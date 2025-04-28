import FollowButton from "@/components/FollowButton";
import { getProfileUser } from "./actions";
import { getCurrentUser } from "@/app/server-actions/user";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function OtherUserProfilePage({ params }: Props) {
  const { userId } = await params;

  const user = await getProfileUser(userId);
  const currentUser = await getCurrentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <section className="profile-page">
      <h1>{user.name} Profile</h1>
      {/* show follow/unfollow button if not viewing own profile */}
      {currentUser?.id !== user.id && (
        <FollowButton
          followingId={user.id}
          followerId={currentUser.id}
          isFollowingInitial={true}
        />
      )}
      {/* display their articles, galleries, etc. */}
    </section>
  );
}
