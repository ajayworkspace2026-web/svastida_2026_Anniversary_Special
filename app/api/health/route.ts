import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "svastida-fashion-store",
    timestamp: new Date().toISOString(),
  });
}
