// app/api/upload-pdf/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import * as fsPromises from 'fs/promises'; // Use fsPromises for async file operations

import path from 'path';

export async function POST(req: NextRequest) {
    console.log("Request started to upload PDF in Next.js API route.");
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        console.error("Authentication required for PDF upload.");
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    let tempFilePath: string | undefined; // Declare tempFilePath outside try for finally block access
    let arrayBuffer: ArrayBuffer | undefined; // Declare arrayBuffer to hold the file content

    try {
        const formData = await req.formData();
        const file = formData.get('pdf') as File | null;
        const userId = formData.get('userId') as string | null; // Still get userId from FormData for validation

        if (!file) {
            console.error("No PDF file found in form data.");
            return NextResponse.json({ message: 'No PDF file uploaded.' }, { status: 400 });
        }

        if (!userId || userId !== session.user.id) {
            console.error("Unauthorized user ID or missing user ID in form data.");
            return NextResponse.json({ message: 'Unauthorized user ID or missing user ID.' }, { status: 403 });
        }

        arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const originalFilename = file.name || 'unnamed.pdf';
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalFilename}`;
        const tempUploadsDir = path.join(process.cwd(), 'temp_uploads');
        tempFilePath = path.join(tempUploadsDir, uniqueFileName);

        await fsPromises.mkdir(tempUploadsDir, { recursive: true });
        await fsPromises.writeFile(tempFilePath, buffer);
        console.log(`Temporary file saved at: ${tempFilePath}`);

        const newDocument = await prisma.document.create({
            data: {
                userId: userId,
                filename: originalFilename,
                filePath: tempFilePath,
            },
        });
        console.log(`Document metadata saved to Prisma. Document ID: ${newDocument.id}`);

        // 2. Forward the file to your separate Node.js backend worker
        const backendFormData = new FormData();
        const fileBlob = new Blob([arrayBuffer], { type: file.type || 'application/octet-stream' });
        backendFormData.append('pdf', fileBlob, originalFilename);
        backendFormData.append('documentId', newDocument.id); // documentId still in body for worker

        // ✨ MODIFIED: Pass userId as a query parameter to the backend ✨
        const backendUrl = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/pdf`);
        backendUrl.searchParams.append('userId', userId); // Add userId as query param

        console.log(`Forwarding file to backend: ${backendUrl.toString()}`);
        const backendRes = await fetch(backendUrl.toString(), {
            method: 'POST',
            body: backendFormData,
        });

        if (!backendRes.ok) {
            const backendError = await backendRes.json();
            console.error(`Backend worker failed to process file: ${backendError.message || backendRes.status}`);
            throw new Error(backendError.message || `Failed to send file to backend worker. Status: ${backendRes.status}`);
        }

        await fsPromises.unlink(tempFilePath);
        console.log(`Temporary file cleaned up: ${tempFilePath}`);

        return NextResponse.json({
            message: 'File uploaded and processing initiated.',
            documentId: newDocument.id,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error in /api/upload-pdf:', error);
        if (tempFilePath) {
            try {
                await fsPromises.unlink(tempFilePath);
                console.log(`Cleaned up temporary file on error: ${tempFilePath}`);
            } catch (cleanupError) {
                console.error("Failed to clean up temp file on error:", cleanupError);
            }
        }
        return NextResponse.json({ message: error.message || 'Internal server error.' }, { status: 500 });
    }
}
