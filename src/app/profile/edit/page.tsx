import { getCurrentUser } from "@/app/server-actions/user";
import ProfileEditForm from "@/components/ProfileEditForm";
import { unauthorized } from "next/navigation";

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  if (!user) {
    unauthorized();
  }
  return <ProfileEditForm userDetails={user} />;
}
