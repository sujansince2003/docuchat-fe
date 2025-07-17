// API route to handle chat. sends request to nodejs server
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions); // Get session using getServerSession

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const { userQuery, documentId, chatSessionId, userId } = await req.json();

    if (!userQuery || !documentId || !userId || userId !== session.user.id) {
        return NextResponse.json({ message: 'Missing required chat parameters or unauthorized user.' }, { status: 400 });
    }

    try {
        let currentChatSession;

        if (chatSessionId) {
            // Find existing chat session
            currentChatSession = await prisma.chatSession.findUnique({
                where: { id: chatSessionId, userId: userId, documentId: documentId },
            });
        }

        if (!currentChatSession) {
            // Create a new chat session if none exists or session ID is invalid
            currentChatSession = await prisma.chatSession.create({
                data: {
                    userId: userId,
                    documentId: documentId,
                },
            });
        }

        // Save user message to database
        await prisma.chatMessage.create({
            data: {
                chatSessionId: currentChatSession.id,
                sender: 'user',
                content: userQuery,
            },
        });

        // Call your Node.js backend API for RAG
        // IMPORTANT: Your backend /chat endpoint is currently a GET request.
        // We are changing the frontend to POST to /api/chat, which then POSTs to your backend.
        // You need to update your backend's /chat endpoint to accept POST requests.
        // Also, ensure NEXT_PUBLIC_BACKEND_URL is set in your Next.js .env
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
            method: 'POST', // Changed to POST to match the new backend expectation
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // Send data in the body
                userQuery: userQuery,
                documentId: documentId, // Pass documentId to backend for Qdrant collection name
                userId: userId, // Pass userId to backend for file path logic if used there
            }),
        });

        if (!backendRes.ok) {
            const backendError = await backendRes.json();
            throw new Error(backendError.message || 'Failed to get response from RAG backend.');
        }

        const backendData = await backendRes.json();
        const aiAnswer = backendData.answer;

        // Save AI message to database
        await prisma.chatMessage.create({
            data: {
                chatSessionId: currentChatSession.id,
                sender: 'ai',
                content: aiAnswer,
            },
        });

        return NextResponse.json({
            answer: aiAnswer,
            chatSessionId: currentChatSession.id, // Return the session ID
        }, { status: 200 });

    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Internal server error:', error);
        return NextResponse.json({ message }, { status: 500 });
    }
}
