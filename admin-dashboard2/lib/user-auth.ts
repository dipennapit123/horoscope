import { headers } from "next/headers";
import { ApiError } from "./api-error";
import { firebaseAdminAuth } from "./firebase-admin";

/**
 * Verifies Firebase ID token (Authorization: Bearer <token>) and returns Firebase uid.
 * For local/dev fallback only, x-firebase-uid is accepted when explicitly enabled.
 */
export async function getUserIdFromRequest(): Promise<string> {
  const h = await headers();
  const authHeader = h.get("authorization");
  const headerUserId = h.get("x-firebase-uid");

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice("Bearer ".length);
      const decoded = await firebaseAdminAuth.verifyIdToken(token, true);
      if (!decoded?.uid) {
        throw new ApiError(401, "Invalid token.");
      }
      return decoded.uid;
    } catch (e) {
      console.error(
        "[user-auth] Firebase verifyIdToken failed:",
        e instanceof Error ? e.message : e,
      );
      // If local/dev fallback is enabled, allow x-firebase-uid when token verification fails.
      // This is useful when Firebase Admin credentials aren't configured in the API runtime.
      if (process.env.ALLOW_HEADER_USER_ID_FALLBACK === "true" && headerUserId) {
        return headerUserId;
      }
      throw new ApiError(401, "Invalid token.");
    }
  }

  // Optional fallback for local testing only.
  if (process.env.ALLOW_HEADER_USER_ID_FALLBACK === "true" && headerUserId) {
    return headerUserId;
  }

  throw new ApiError(401, "Missing authenticated user.");
}
