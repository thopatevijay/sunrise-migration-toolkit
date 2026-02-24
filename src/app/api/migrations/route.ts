import { NextResponse } from "next/server";
import { fetchMigrationHealth } from "@/lib/data/migration-health";
import { getHealthSnapshot } from "@/lib/data/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const migrations = await fetchMigrationHealth();

    return NextResponse.json({
      migrations,
      lastUpdated: new Date().toISOString(),
      providerHealth: getHealthSnapshot(),
    });
  } catch (error) {
    console.error("[api/migrations] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch migration health" },
      { status: 500 }
    );
  }
}
