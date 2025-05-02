import Link from "next/link";
import ProfilePictureIcon from "./ProfilePictureIcon";
import { User } from "@prisma/client";

type Props = {
  user: User;
};

export default function UserListItem({ user }: Props) {
  return (
    <Link href={`/profile/${user.id}`}>
      <div className="flex items-center gap-2">
        <ProfilePictureIcon
          profilePic={user.profilePic}
          width={30}
          height={30}
        />
        <div className="text-container flex-1 min-w-0">
          <p className="text-sm font-semibold md:text-lg">{user.name}</p>
          <p className=" text-xs text-muted-foreground md:text-sm min-h-5 truncate">
            {user.bio || ""}
          </p>
        </div>
        {/* <FollowButton followerId={} followingId={} isFollowing={} /> */}
      </div>
    </Link>
  );
}
