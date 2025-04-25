"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // You can directly specify the callback URL here
    router.push("/"); // Redirect to the homepage after sign-out
  };
  return (
    <h2 className="cursor-pointer" onClick={handleSignOut}>
      Sign Out
    </h2>
  );
}
