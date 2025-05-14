import { fetchCurrentUser } from "@/app/profile/[userId]/actions";
import ProfileEditForm from "@/components/ProfileEditForm";
import { unauthorized } from "next/navigation";

export default async function ProfileEditPage() {
  const user = await fetchCurrentUser();
  if (!user) {
    unauthorized();
  }
  return <ProfileEditForm userDetails={user} />;
}
