import { firebaseAuth } from "./firebase";
import { useSessionStore } from "../store/useSessionStore";

/** Forces a fresh Firebase ID token and updates the session store (fixes backend "Invalid token." when JWT expired). */
export async function refreshAndStoreFirebaseIdToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  const token = await user.getIdToken(true);
  useSessionStore.getState().setAuth({ clerkUserId: user.uid, token });
  return token;
}
