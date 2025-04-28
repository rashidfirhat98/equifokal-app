import { unauthorized } from "next/navigation";
import DashboardTabs from "@/components/DashboardTabs";
import DashboardUserDetails from "@/components/DashboardUserDetails";
import { getCurrentUser } from "../server-actions/user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    unauthorized();
  }
  return (
    <>
      <DashboardUserDetails user={user} />
      <DashboardTabs />
    </>
  );
}
