import { NextResponse } from "next/server";
import { getTokenDetail } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const token = await getTokenDetail(id);

  if (!token) {
    return NextResponse.json(
      { error: "Token not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(token);
}
