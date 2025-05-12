import DashboardTabs from "@/components/DashboardTabs";
import DashboardUserDetails from "@/components/DashboardUserDetails";

export default async function DashboardPage() {
  return (
    <>
      <DashboardUserDetails />
      <DashboardTabs />
    </>
  );
}
