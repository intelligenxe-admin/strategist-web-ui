import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "https://intelligenxe.org/api/rag";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${RAG_API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      data || { error: "Login failed" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
