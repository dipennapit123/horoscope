import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * Clears the native Google Sign-In session. Firebase `signOut()` alone does not
 * do this — without this, the next `GoogleSignin.signIn()` often reuses the same
 * Google account with no account picker.
 */
export async function clearGoogleSignInSession(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // No-op: not configured, Expo Go, or no prior Google sign-in
  }
  try {
    await GoogleSignin.revokeAccess();
  } catch {
    // No-op: revoke can fail if there was no OAuth grant to revoke
  }
}
