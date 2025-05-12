import UploadClientPage from "./UploadClientPage";
import { fetchUserPhotoCount, fetchUserSession } from "./actions";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const user = await fetchUserSession();
  if (!user) return redirect("/login"); // or unauthorized()

  const photoCount = await fetchUserPhotoCount(user.id);

  return <UploadClientPage photoCount={photoCount} />;
}
