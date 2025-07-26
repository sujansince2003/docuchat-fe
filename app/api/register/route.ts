import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error during user registration:", error);

        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}  