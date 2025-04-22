import Link from "next/link";
import Search from "./Search";

import { authOptions } from "@/lib/authOptions";
import SignOutButton from "./SignOutButton";
import NavAccountIcon from "./NavAccountIcon";
import { getCurrentUser } from "@/app/dashboard/actions";

export default async function Navbar() {
  const user = await getCurrentUser();
  return (
    <header className="bg-black sticky top-0 z-10">
      <nav className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center p-4 font-bold max-w-6xl mx-auto text-white">
        <div>
          <h1 className="text-2xl sm:text-3xl text-center whitespace-nowrap">
            <Link href="/">Equifokal</Link>
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Search />
          <div className="flex flex-row gap-5 items-center">
            {user ? (
              // <div className="col-span-1 flex items-center justify-center">
              <>
                <NavAccountIcon user={user} />
                <SignOutButton />
              </>
            ) : (
              // </div>
              <>
                <h2>
                  <Link href="/login">Login</Link>
                </h2>
                <h2>
                  <Link href="/register">Register</Link>
                </h2>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
