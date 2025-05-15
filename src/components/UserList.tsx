"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UserListItem from "./UserListItem";
import { Loader2 } from "lucide-react";

type Props = {
  userId: string;
  currentUserId?: string;
  type: "follower" | "following";
};

type Follower = {
  id: string;
  name: string;
  profilePic: string;
  bio?: string;
  isFollowing?: boolean;
};

export default function UserList({ userId, currentUserId, type }: Props) {
  const [users, setUsers] = useState<Follower[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchUsers = useCallback(async () => {
    if (isFetchingRef.current) return;

    if (hasLoaded && nextCursor === null) return;
    const fetchUrl =
      type === "follower"
        ? `/api/user/${userId}/followers?cursor=${
            nextCursor ?? ""
          }&limit=2&viewingUserId=${currentUserId}`
        : `/api/user/${userId}/followings?cursor=${
            nextCursor ?? ""
          }&limit=2&viewingUserId=${currentUserId}`;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      setUsers((prev) => [
        ...prev,
        ...(type === "follower" ? data.followers : data.followings),
      ]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      isFetchingRef.current = false;
    }
  }, [nextCursor, userId, hasLoaded, type, currentUserId]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
          fetchUsers();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    didMountRef.current = true;

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [nextCursor, loading, fetchUsers]);

  return (
    <section className="px-2 mt-3 pb-3">
      {!hasLoaded ? (
        <div className="col-span-full text-center py-8">
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        </div>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div className="my-3 p-3 border-b-2" key={user.id}>
            <UserListItem
              user={user}
              currentUserId={currentUserId}
              isFollowingInitial={user.isFollowing}
            />
          </div>
        ))
      ) : (
        <div className="text-center large">User has no {type}s yet</div>
      )}
      <div ref={loaderRef} className="loader my-6">
        {loading && hasLoaded && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </section>
  );
}
