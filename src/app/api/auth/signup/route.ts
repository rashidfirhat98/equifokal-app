import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

function validateInput(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    return "All fields are required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
}

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    const hashedPassword = await hashPassword(password);

    const validationError = validateInput(name, email, password);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return NextResponse.json(
      { message: `User created successfully` },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
