import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { title, content, coverImage, tags } = await req.json();

        const newArticle = await prisma.article.create({
            data: {
                title,
                content,
                coverImage,
                tags: tags ? { set: tags } : undefined,
            },
        });

        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}