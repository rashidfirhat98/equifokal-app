import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionContext";
import { authOptions } from "@/lib/authOptions";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
