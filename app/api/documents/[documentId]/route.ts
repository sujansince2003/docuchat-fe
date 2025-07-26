import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 })
    }


    const resolvedParams = await params
    const documentIdToDelete = resolvedParams.documentId

    const { userId } = await req.json()

    if (!documentIdToDelete || !userId || userId !== session.user.id) {
        return NextResponse.json({ message: "Missing document ID or unauthorized user." }, { status: 400 })
    }

    try {
        // 1. Find the document to get its qdrantId (collection name)
        const document = await prisma.document.findUnique({
            where: { id: documentIdToDelete, userId: userId },
            select: { qdrantId: true, filePath: true }, // Also get filePath to delete the actual file
        })

        if (!document) {
            return NextResponse.json({ message: "Document not found or unauthorized." }, { status: 404 })
        }

        // 2. Delete the Qdrant collection
        if (document.qdrantId) {
            const qdrantDeleteRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-collection`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collectionName: document.qdrantId }),
            })

            if (!qdrantDeleteRes.ok) {
                // Log error but don't necessarily fail the entire request if Prisma delete succeeds
                console.warn(`Failed to delete Qdrant collection ${document.qdrantId}:`, await qdrantDeleteRes.json())
            }
        }

        // 3. Delete the actual PDF file from the backend's uploads folder
        if (document.filePath) {
            const deleteFileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-file`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath: document.filePath }),
            })

            if (!deleteFileRes.ok) {
                console.warn(`Failed to delete physical file ${document.filePath}:`, await deleteFileRes.json())
            }
        }

        // 4. Delete document and associated chat sessions/messages from Prisma
        // Prisma's onDelete: Cascade will handle ChatSession and ChatMessage deletion
        await prisma.document.delete({
            where: { id: documentIdToDelete },
        })

        return NextResponse.json({ message: "Document and associated data deleted successfully." }, { status: 200 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting document:", error)
        return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 })
    }
}
