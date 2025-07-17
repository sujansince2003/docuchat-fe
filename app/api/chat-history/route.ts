// fetch the chat history from DB according to user and documents
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions); // Get session using getServerSession

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const documentId = searchParams.get('documentId');

    if (!userId || !documentId || userId !== session.user.id) {
        return NextResponse.json({ message: 'Missing required parameters or unauthorized user.' }, { status: 400 });
    }

    try {
        // Find the most recent chat session for this user and document
        const chatSession = await prisma.chatSession.findFirst({
            where: {
                userId: userId,
                documentId: documentId,
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent session
            },
            include: {
                messages: {
                    orderBy: {
                        timestamp: 'asc', // Order messages chronologically
                    },
                },
            },
        });

        // If no session exists, return empty messages and no session ID
        if (!chatSession) {
            return NextResponse.json({ messages: [], chatSessionId: null }, { status: 200 });
        }

        return NextResponse.json({
            messages: chatSession.messages,
            chatSessionId: chatSession.id,
        }, { status: 200 });

    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ message }, { status: 500 });

    }
}

