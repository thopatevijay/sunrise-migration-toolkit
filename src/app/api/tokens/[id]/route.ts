import { NextResponse } from "next/server";
import { getTokenDetail } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const token = getTokenDetail(params.id);

  if (!token) {
    return NextResponse.json(
      { error: "Token not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(token);
}
