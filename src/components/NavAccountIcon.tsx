"use client";

import Image from "next/image";
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfilePictureIcon from "./ProfilePictureIcon";

type Props = {
  user: {
    name: string;
    id: string;
    email: string;
    emailVerified: Date | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    profilePic: string | null;
    bio: string | null;
  };
};

export default function NavAccountIcon({ user }: Props) {
  const profilePicUrl = null;
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // You can directly specify the callback URL here
    router.push("/"); // Redirect to the homepage after sign-out
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <ProfilePictureIcon
          profilePicURL={profilePicUrl}
          width={40}
          height={40}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex-1" href="/dashboard">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex-1" href="/photo-bucket">
              Photo Bucket
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="flex-1" href="/gallery">
              Galleries
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Link className="flex-1" href="/gallery">
                Galleries
              </Link>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link className="flex-1" href="/create/gallery">
                    Create a gallery
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Link className="flex-1" href="/article">
                Articles
              </Link>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link className="flex-1" href="/create/article">
                    Create an article
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
