import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, coverImageId } = await req.json();

        const newArticle = await prisma.article.create({
            data: {
                title,
                content,
                user: { connect: { id: session.user.id } },
                coverImageId: coverImageId || undefined,
            },
        });

        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}