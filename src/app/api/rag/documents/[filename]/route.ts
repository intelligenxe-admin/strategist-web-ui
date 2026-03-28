import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "https://intelligenxe.org/api/rag";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  const res = await fetch(`${RAG_API_URL}/documents/${encodeURIComponent(filename)}/`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      data || { error: "Failed to delete document" },
      { status: res.status }
    );
  }

  return NextResponse.json({ message: "Document deleted" });
}
