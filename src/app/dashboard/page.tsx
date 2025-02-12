import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;
    const currentUser = await prisma.user.findUnique({
      where: { email: session?.user.email || undefined },
    });
    console.log("user:" + currentUser);
    if (!currentUser) return;

    return currentUser;
  } catch (error) {
    console.log(error);
    return;
  }
};
export default async function DashboardPage() {
  const user = await getCurrentUser();
  console.log(user);
  if (!user) {
    unauthorized();
  }
  return <div>DashboardPage</div>;
}
