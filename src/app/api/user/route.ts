import { NextResponse } from "next/server";

// Serverless user database store (per server instance / persistent backend)
const userDatabase: Record<string, {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google";
  createdAt: number;
  activePasses: {
    type: string;
    expiresAt: number;
  }[];
  roomsJoined: number;
}> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ success: false, message: "Email parameter required" }, { status: 400 });
  }

  const user = userDatabase[email];
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, avatar, activePass } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = userDatabase[cleanEmail] || {};

    const updatedUser = {
      id: id || existing.id || `user_${Date.now()}`,
      name: name || existing.name || cleanEmail.split("@")[0],
      email: cleanEmail,
      avatar: avatar || existing.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      provider: "google" as const,
      createdAt: existing.createdAt || Date.now(),
      activePasses: existing.activePasses || [],
      roomsJoined: (existing.roomsJoined || 0) + 1,
    };

    if (activePass) {
      updatedUser.activePasses.push(activePass);
    }

    userDatabase[cleanEmail] = updatedUser;

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
