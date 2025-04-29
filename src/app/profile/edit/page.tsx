import ProfileEditForm from "@/components/ProfileEditForm";
import { unauthorized } from "next/navigation";
import { fetchCurrentUser } from "../[userId]/actions";

export default async function ProfileEditPage() {
  const user = await fetchCurrentUser();
  if (!user) {
    unauthorized();
  }
  return <ProfileEditForm userDetails={user} />;
}
