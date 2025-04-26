import FollowButton from "@/components/FollowButton";
import { getCurrentUser, getProfileUser } from "./actions";

type Props = {
  params: { userId: string };
};

export default async function OtherUserProfilePage({ params }: Props) {
  const user = await getProfileUser(params.userId);
  const currentUser = await getCurrentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <section className="profile-page">
      <h1>{user.name}'s Profile</h1>
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
