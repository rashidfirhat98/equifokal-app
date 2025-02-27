import Link from "next/link";
import Search from "./Search";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SignOutButton from "./SignOutButton";
import NavAccountIcon from "./NavAccountIcon";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
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
            {session ? (
              // <div className="col-span-1 flex items-center justify-center">
              <>
                <NavAccountIcon />
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
