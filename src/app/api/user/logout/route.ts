import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully", success: true });
    // Clear the auth token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    return response;
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err?.message ?? "Internal Server Error" }, { status: 500 });
  }
}
