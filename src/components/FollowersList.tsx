import { User } from "@prisma/client";
import React from "react";
import UserListItem from "./UserListItem";

type Props = {
  follower: User[];
};

export default function FollowersList({ follower }: Props) {
  return (
    <section className="px-2 mt-3 pb-3">
      {follower ? (
        follower.map((user) => (
          <div className="my-3 p-3 md:p-3 border-b-2" key={user.id}>
            <UserListItem user={user} />
          </div>
        ))
      ) : (
        <div>
          <p className="large">No follower yet</p>
        </div>
      )}
    </section>
  );
}
