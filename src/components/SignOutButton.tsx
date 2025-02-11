"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return <h2 onClick={() => signOut()}>Sign Out</h2>;
}
