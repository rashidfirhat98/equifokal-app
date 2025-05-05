import { User } from "@prisma/client";
import React from "react";
import UserListItem from "./UserListItem";

type Props = {
  users: User[];
};

export default function UserList({ users }: Props) {
  return (
    <section className="px-2 mt-3 pb-3">
      {users ? (
        users.map((user) => (
          <div className="my-3 p-3 border-b-2" key={user.id}>
            <UserListItem user={user} />
          </div>
        ))
      ) : (
        <div className="text-center large">
          User is not following anyone yet
        </div>
      )}
    </section>
  );
}
