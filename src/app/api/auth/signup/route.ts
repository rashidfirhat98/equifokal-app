import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db/user";
import { createNewUser } from "@/lib/services/user";

function validateInput(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    return "All fields are required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  const regex = /(?=.*[A-Z])(?=.*[!@#$%^&*])/;
  if (!regex.test(password))
    return "Password must include at least one uppercase letter and one special character";
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const validationError = validateInput(name, email, password);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await createNewUser({ email, name, password });

    return NextResponse.json(
      { message: `User ${user.name} created successfully at` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
