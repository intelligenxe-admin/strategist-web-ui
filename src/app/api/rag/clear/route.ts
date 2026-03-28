import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "https://intelligenxe.org/api/rag";

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${RAG_API_URL}/clear/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ confirm: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      data || { error: "Failed to clear knowledge base" },
      { status: res.status }
    );
  }

  return NextResponse.json({ message: "Knowledge base cleared" });
}
