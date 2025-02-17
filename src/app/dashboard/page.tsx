import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { unauthorized } from "next/navigation";
import profilePic from "@/assets/images/EQFKL_logo.jpg";

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
  return (
    <section className="px-4 py-12">
      <div className="sm:grid sm:grid-cols-4 sm:gap-3 flex flex-col justify-center items-center">
        <div className="col-span-1 flex flex-col items-center">
          <Image
            width={50}
            height={50}
            alt="profile-pic"
            src={profilePic}
            className="rounded-full"
          />
          <h1 className="font-bold text-xl sm:text-2xl text-center">
            User Dashboard
          </h1>
        </div>
        <div className="col-span-3 h-full flex flex-col items-center pl-4 border-l-2 border-gray-100 ">
          <h2>User Detail section</h2>
        </div>
      </div>
    </section>
  );
}
