import { NextResponse } from "next/server";

// Serverless user database store (bound to user Google accounts)
const userDatabase: Record<string, {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google";
  createdAt: number;
  isPremium: boolean;
  redeemedCodes: string[];
  activePasses: {
    type: string;
    expiresAt: number;
  }[];
  roomsJoined: number;
}> = {
  "chunleon13@gmail.com": {
    id: "user_chunleon13",
    name: "Chunleon",
    email: "chunleon13@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chunleon13%40gmail.com",
    provider: "google",
    createdAt: Date.now(),
    isPremium: true,
    redeemedCodes: ["DOKU_PAYMENT_SUCCESS"],
    activePasses: [{ type: "pass_10jam", expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 }],
    roomsJoined: 1
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ success: false, message: "Email parameter required" }, { status: 400 });
  }

  let user = userDatabase[email];

  // Auto grant premium if email is chunleon13@gmail.com
  if (email === "chunleon13@gmail.com") {
    if (!user) {
      userDatabase[email] = {
        id: "user_chunleon13",
        name: "Chunleon",
        email: "chunleon13@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chunleon13%40gmail.com",
        provider: "google",
        createdAt: Date.now(),
        isPremium: true,
        redeemedCodes: ["DOKU_PAYMENT_SUCCESS"],
        activePasses: [{ type: "pass_10jam", expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 }],
        roomsJoined: 1
      };
      user = userDatabase[email];
    } else {
      user.isPremium = true;
    }
  }

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, avatar, isPremium, redeemCode, activePass } = body;

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
      isPremium: cleanEmail === "chunleon13@gmail.com" ? true : (isPremium !== undefined ? isPremium : (existing.isPremium || false)),
      redeemedCodes: existing.redeemedCodes || [],
      activePasses: existing.activePasses || [],
      roomsJoined: (existing.roomsJoined || 0) + 1,
    };

    if (redeemCode && !updatedUser.redeemedCodes.includes(redeemCode.toUpperCase())) {
      updatedUser.redeemedCodes.push(redeemCode.toUpperCase());
      if (redeemCode.toUpperCase() === "OS4FREE") {
        updatedUser.isPremium = true;
      }
    }

    if (activePass) {
      updatedUser.activePasses.push(activePass);
    }

    userDatabase[cleanEmail] = updatedUser;

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
