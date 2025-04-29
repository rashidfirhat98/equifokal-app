import { unauthorized } from "next/navigation";
import DashboardTabs from "@/components/DashboardTabs";
import DashboardUserDetails from "@/components/DashboardUserDetails";
import { fetchCurrentUser } from "./actions";

export default async function DashboardPage() {
  const user = await fetchCurrentUser();

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
