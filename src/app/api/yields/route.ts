import { NextResponse } from "next/server";
import { fetchSolanaYields } from "@/lib/data/providers/defillama-yields";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const yields = await fetchSolanaYields();
    return NextResponse.json(yields);
  } catch (e) {
    console.error("[api/yields] error:", e);
    return NextResponse.json({}, { status: 200 });
  }
}
