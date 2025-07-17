import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || userId !== session.user.id) {
        return NextResponse.json({ message: 'Unauthorized user ID.' }, { status: 403 });
    }

    try {
        const documents = await prisma.document.findMany({
            where: { userId: userId },
            orderBy: { uploadedAt: 'desc' },
            select: {
                id: true,
                filename: true,
                uploadedAt: true,
            },
        });

        return NextResponse.json({ documents }, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ message: error.message || 'Internal server error.' }, { status: 500 });
    }
}
