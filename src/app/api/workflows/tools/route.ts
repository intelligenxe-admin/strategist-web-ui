import { NextRequest, NextResponse } from "next/server";

const WORKFLOWS_API_URL = process.env.WORKFLOWS_API_URL || "https://intelligenxe.org/api/workflows";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${WORKFLOWS_API_URL}/tools/`, {
    headers: { Authorization: authHeader },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      data || { error: "Failed to fetch tools" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
