import {
  fetchCurrentUser,
  fetchIsFollowing,
  fetchProfileUser,
} from "./actions";
import DashboardUserDetails from "@/components/DashboardUserDetails";
import DashboardTabs from "@/components/DashboardTabs";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function OtherUserProfilePage({ params }: Props) {
  const { userId } = await params;

  const user = await fetchProfileUser(userId);
  const currentUser = await fetchCurrentUser();
  const isFollowing = await fetchIsFollowing(user.id, currentUser?.id);

  if (!user) {
    return <div>User not found</div>;
  }

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <section className="profile-page">
      <DashboardUserDetails
        user={user}
        currentUser={currentUser}
        isFollowingInitial={isFollowing}
      />
      <DashboardTabs user={user} />
    </section>
  );
}
