import { NextResponse } from "next/server";

// Global in-memory room store (per server instance)
const rooms: Record<string, {
  code: string;
  host: string;
  mode: string;
  topic: string;
  rounds: number;
  players: string[];
  status: string;
  updatedAt: number;
  gameState?: {
    activePlayerIndex: number;
    rotation: number;
    landedIndex: number | null;
    todPhase: string;
    chosenType: string | null;
    todContent: string;
    dismissed: boolean[];
    activeModalIndex: number | null;
  };
}> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").toUpperCase();

  if (!code) {
    return NextResponse.json({ success: false, message: "Code parameter is required" }, { status: 400 });
  }

  const room = rooms[code];
  if (!room) {
    return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, room });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, host, mode, topic, rounds, players, status, gameState } = body;

    if (!code) {
      return NextResponse.json({ success: false, message: "Code parameter is required" }, { status: 400 });
    }

    const cleanCode = code.toUpperCase();
    const existing = rooms[cleanCode] || {};

    const updatedRoom = {
      code: cleanCode,
      host: host || existing.host || "Host",
      mode: mode || existing.mode || "pertanyaan",
      topic: topic || existing.topic || "kenalan",
      rounds: rounds || existing.rounds || 3,
      players: Array.from(new Set([...(existing.players || []), ...(players || [])])),
      status: status || existing.status || "lobby",
      updatedAt: Date.now(),
      gameState: { ...(existing.gameState || {}), ...(gameState || {}) },
    };

    rooms[cleanCode] = updatedRoom;

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
