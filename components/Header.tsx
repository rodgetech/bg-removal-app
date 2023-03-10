import Link from "next/link";
import { registerOrLogin } from "@/lib/auth";
import { useAtomValue } from "jotai";
import { userAuthAtom } from "@/atoms";
import Image from "next/image";
import { Home2, PhotoEdit } from "tabler-icons-react";
import Dropdown from "./Dropdown";

export default function Header() {
  const { isAuthenticated } = useAtomValue(userAuthAtom);

  return (
    <div
      className={`block items-center gap-12 border-b border-b-zinc-200 py-8 md:flex md:border-b-0`}
    >
      <div className="mb-5 text-center text-lg md:mb-0">
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 sm:justify-start "
          >
            <Image
              alt="header logo"
              src="/photo.svg"
              className="h-7 w-7 sm:h-8 sm:w-8"
              width={24}
              height={24}
            />
            <h1 className="ml-2 text-xl tracking-tight">
              background removal app
            </h1>
          </Link>
          {isAuthenticated && (
            <div className="md:hidden">
              <Dropdown />
            </div>
          )}
        </div>
      </div>
      <div className="block flex-1">
        <ul className="flex items-center justify-center gap-5 text-lg text-zinc-600 md:justify-end">
          {!isAuthenticated && (
            <>
              <li>
                <button
                  className="cursor-pointer rounded-md border border-zinc-200 py-2 px-4 active:bg-zinc-200"
                  onClick={registerOrLogin}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="cursor-pointer rounded-md bg-black py-2 px-4 text-white hover:text-zinc-300"
                  onClick={registerOrLogin}
                >
                  Get Started
                </button>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li className="hidden md:block">
                <Link href="/">
                  <button className="flex cursor-pointer gap-1 py-2 px-2 hover:text-black active:bg-zinc-200">
                    <Home2 />
                    Home
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/remove">
                  <button className="hidden cursor-pointer gap-1 py-2 px-2 hover:text-black active:bg-zinc-200 sm:flex">
                    <PhotoEdit />
                    Remove Background
                  </button>
                </Link>
                <Link href="/remove">
                  <button className="flex cursor-pointer items-center gap-1 rounded-md bg-black py-1 px-4 text-sm text-white hover:text-zinc-300 sm:hidden">
                    <PhotoEdit />
                    Remove Background
                  </button>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className="hidden sm:block">
              <Dropdown />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
