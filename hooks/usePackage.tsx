import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { useCookies } from "react-cookie";
import { COOKIE_ID, MAX_FREE_CREDITS } from "@/lib/const";
import { AnonymousData } from "@/pages/_app";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package } from "@/components/Packages";

export type ProfilePackage = Package & { used: number };

export default function usePackage() {
  const { user, loading } = useAuth();
  const [cookies, setCookie] = useCookies([COOKIE_ID]);

  const [used, setUsed] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);
  const [packageId, setPackageId] = useState<string>();

  const incrementFreeUsed = () => {
    const data = cookies.anonymous_data as AnonymousData;

    setCookie(COOKIE_ID, {
      used: ++data.used,
    });
  };

  const hasCredit = () => {
    return used < limit;
  };

  useEffect(() => {
    if (!loading && !user) {
      const anonymousData = cookies.anonymous_data as AnonymousData;
      setLimit(MAX_FREE_CREDITS);
      setUsed(anonymousData.used);
    }
  }, [loading, cookies.anonymous_data, user]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "profiles", user.id), (doc) => {
        console.log("Current data: ", doc.data());
        const profile = doc.data();
        if (profile) {
          const profilePackage = profile.package as ProfilePackage;
          setUsed(profilePackage.used);
          setLimit(profilePackage.limit);
          setPackageId(profilePackage.id);
        }
      });

      return () => {
        unsub();
      };
    }
  }, [user]);

  return {
    limit,
    used,
    packageId,
    incrementFreeUsed,
    hasCredit,
  };
}