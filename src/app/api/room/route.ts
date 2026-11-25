import { NextResponse } from "next/server";

export interface GameRoomState {
  code: string;
  host: string;
  mode: 'pertanyaan' | 'tod';
  topic: string;
  rounds: number;
  players: string[];
  status: 'lobby' | 'playing' | 'finished';
  updatedAt: number;
  gameState?: {
    version: number;
    updatedAt: number;
    // Questions sync
    roundQuestions?: string[];
    allQuestions?: string[];
    currentRound?: number;
    // Card modal & turns sync
    activePlayerIndex?: number;
    activeModalIndex?: number | null;
    activeQuestionText?: string;
    dismissed?: boolean[];
    // Truth or Dare roulette sync
    rotation?: number;
    landedIndex?: number | null;
    todPhase?: 'spin' | 'choice' | 'reveal';
    chosenType?: 'truth' | 'dare' | null;
    todContent?: string;
    spinning?: boolean;
  };
}

// Global in-memory room store bound to globalThis for process resilience
const rooms: Record<string, GameRoomState> = (globalThis as any).__obrolan_rooms || ((globalThis as any).__obrolan_rooms = {});

function cleanStaleRooms() {
  const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
  for (const k of Object.keys(rooms)) {
    if (rooms[k]?.updatedAt && rooms[k].updatedAt < sixHoursAgo) {
      delete rooms[k];
    }
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ success: false, message: "Code parameter is required" }, { status: 400 });
  }

  cleanStaleRooms();

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

    const cleanCode = code.trim().toUpperCase();
    cleanStaleRooms();

    const existing = rooms[cleanCode] || {} as Partial<GameRoomState>;
    const now = Date.now();
    const currentGS: any = existing.gameState || {};
    const nextVersion = (currentGS.version || 0) + 1;

    const mergedPlayers = Array.from(new Set([...(existing.players || []), ...(players || [])])).filter(Boolean);

    const updatedRoom: GameRoomState = {
      code: cleanCode,
      host: host || existing.host || "Host",
      mode: mode || existing.mode || "pertanyaan",
      topic: topic || existing.topic || "kenalan",
      rounds: rounds || existing.rounds || 3,
      players: mergedPlayers.length > 0 ? mergedPlayers : ["Host"],
      status: status || existing.status || "lobby",
      updatedAt: now,
      gameState: {
        ...currentGS,
        ...(gameState || {}),
        version: nextVersion,
        updatedAt: now,
      },
    };

    rooms[cleanCode] = updatedRoom;

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
