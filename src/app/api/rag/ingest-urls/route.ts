import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "https://intelligenxe.org/api/rag";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${RAG_API_URL}/ingest-urls/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    data = { error: `Backend returned ${res.status}: ${text.slice(0, 200)}` };
  }

  if (!res.ok) {
    return NextResponse.json(
      data || { error: `URL ingestion failed (${res.status})` },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
