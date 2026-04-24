import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { syncFirebaseUser } from "@/lib/user.service";
import { handleApiError } from "@/lib/api-error";

const bodySchema = z.object({
  firebaseUid: z.string(),
  email: z.string().email(),
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
  timezone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid user payload." } },
        { status: 400 }
      );
    }
    const user = await syncFirebaseUser(parsed.data);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    const { status, message } = handleApiError(err);
    return NextResponse.json(
      { success: false, error: { message } },
      { status }
    );
  }
}
