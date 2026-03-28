import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "https://intelligenxe.org/api/rag";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const res = await fetch(`${RAG_API_URL}/upload/`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      data || { error: "Upload failed" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
