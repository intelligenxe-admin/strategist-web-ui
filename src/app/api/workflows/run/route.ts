import { NextRequest, NextResponse } from "next/server";

const WORKFLOWS_API_URL = process.env.WORKFLOWS_API_URL || "https://intelligenxe.org/api/workflows";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${WORKFLOWS_API_URL}/run/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
