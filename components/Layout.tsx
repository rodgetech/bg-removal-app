import { ReactNode, useEffect } from "react";
import { Poppins } from "@next/font/google";
import Header from "./Header";
import Footer from "./Footer";
import useAuth from "@/hooks/useAuth";
import { anonymouslySignIn } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function Layout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   signOut(auth);
  // }, []);

  useEffect(() => {
    console.log(loading);
    if (!user && !loading) {
      console.log("user not authenticated");
      anonymouslySignIn();
    }
  }, [loading, user]);

  return (
    <div
      className={`${poppins.className} m-auto flex min-h-screen max-w-5xl flex-col px-4 text-zinc-700 md:px-0`}
    >
      <Header />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
