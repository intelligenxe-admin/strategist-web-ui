import { NextRequest, NextResponse } from "next/server";

const WORKFLOWS_API_URL = process.env.WORKFLOWS_API_URL || "https://intelligenxe.org/api/workflows";

export const maxDuration = 600;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600_000);

  try {
    const res = await fetch(`${WORKFLOWS_API_URL}/run/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        data || { error: "Workflow execution failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Workflow execution timed out" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Workflow execution failed" },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
