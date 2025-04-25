import { unauthorized } from "next/navigation";
import DashboardTabs from "@/components/DashboardTabs";
import { getCurrentUser } from "./actions";
import DashboardUserDetails from "@/components/DashboardUserDetails";

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
