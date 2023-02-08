import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { getPackages } from "./packages";
import { getUserProfile } from "./profiles";

const provider = new GoogleAuthProvider();

export type FormattedUser = {
  uid: string;
  email: string | null;
  name: string | null;
  provider: string;
  photoUrl: string | null;
  token: string;
  expirationTime: string;
};

export async function registerOrLogin(): Promise<{
  errorCode?: string;
  errorMessage?: string;
  user?: FormattedUser;
}> {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    // The signed-in user info.
    const user = result.user;
    const userId = user.uid;

    const existingProfile = await getUserProfile(userId);

    // Create profile on first sign in
    if (!existingProfile) {
      const packagesQuery = query(
        collection(db, "credit_packages"),
        where("price", "==", 0)
      );
      const packagesSnapshot = await getPackages(packagesQuery);
      const packageData = packagesSnapshot[0];

      // Assign free package for new users
      const profilesRef = collection(db, "profiles");
      await setDoc(doc(profilesRef), {
        userId,
        package: {
          id: packageData.id,
          price: packageData.data().price,
          limit: packageData.data().limit,
          used: 0,
        },
        "_createdBy.timestamp": new Date(),
      });
    }

    const formattedUser = await formatUser(user);

    return { user: formattedUser };
  } catch (error: any) {
    console.log("Failed to sign in", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return { errorCode, errorMessage };
  }
}

export const formatUser = async (user: User) => {
  const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true);
  const { token, expirationTime } = decodedToken;
  console.log(token);
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    token,
    expirationTime,
  };
};
