import { NextResponse } from "next/server";

// Serverless user database store (bound to user Google accounts)
const userDatabase: Record<string, {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google";
  createdAt: number;
  isPermanentPremium?: boolean;
  redeemedCodes: string[];
  seenQuestions: string[];
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
    isPermanentPremium: true,
    redeemedCodes: ["DOKU_PAYMENT_SUCCESS", "OS4FREE"],
    seenQuestions: [],
    activePasses: [{ type: "pass_permanent", expiresAt: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 }],
    roomsJoined: 1
  }
};

// Helper to evaluate active premium status & max expiry timestamp
function checkUserPremiumStatus(user: any) {
  if (!user) return { isPremium: false, passExpiresAt: 0 };
  if (user.email === "chunleon13@gmail.com" || user.isPermanentPremium) {
    return { isPremium: true, passExpiresAt: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 };
  }

  const validPasses = (user.activePasses || []).filter((p: any) => p.expiresAt > Date.now());
  if (validPasses.length > 0) {
    const maxExpiresAt = Math.max(...validPasses.map((p: any) => p.expiresAt));
    return { isPremium: true, passExpiresAt: maxExpiresAt };
  }

  return { isPremium: false, passExpiresAt: 0 };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ success: false, message: "Email parameter required" }, { status: 400 });
  }

  let user = userDatabase[email];

  if (email === "chunleon13@gmail.com") {
    if (!user) {
      userDatabase[email] = {
        id: "user_chunleon13",
        name: "Chunleon",
        email: "chunleon13@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chunleon13%40gmail.com",
        provider: "google",
        createdAt: Date.now(),
        isPermanentPremium: true,
        redeemedCodes: ["DOKU_PAYMENT_SUCCESS", "OS4FREE"],
        seenQuestions: [],
        activePasses: [{ type: "pass_permanent", expiresAt: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 }],
        roomsJoined: 1
      };
      user = userDatabase[email];
    } else {
      user.isPermanentPremium = true;
    }
  }

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  const { isPremium, passExpiresAt } = checkUserPremiumStatus(user);

  return NextResponse.json({
    success: true,
    user: {
      ...user,
      isPremium,
      passExpiresAt
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, avatar, isPermanentPremium, redeemCode, activePass, newSeenQuestions } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = userDatabase[cleanEmail] || {};

    const existingSeen = existing.seenQuestions || [];
    let mergedSeen = existingSeen;
    if (Array.isArray(newSeenQuestions) && newSeenQuestions.length > 0) {
      const normalizedNew = newSeenQuestions.map((q: string) => String(q).trim());
      mergedSeen = Array.from(new Set([...existingSeen, ...normalizedNew])).slice(-500);
    }

    const existingRedeemed = existing.redeemedCodes || [];
    const activePasses = existing.activePasses || [];

    const updatedUser = {
      id: id || existing.id || `user_${Date.now()}`,
      name: name || existing.name || cleanEmail.split("@")[0],
      email: cleanEmail,
      avatar: avatar || existing.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      provider: "google" as const,
      createdAt: existing.createdAt || Date.now(),
      isPermanentPremium: cleanEmail === "chunleon13@gmail.com" ? true : (isPermanentPremium || existing.isPermanentPremium || false),
      redeemedCodes: existingRedeemed,
      seenQuestions: mergedSeen,
      activePasses: activePasses,
      roomsJoined: (existing.roomsJoined || 0) + 1,
    };

    if (redeemCode) {
      const cleanCode = redeemCode.trim().toUpperCase();
      if (existingRedeemed.includes(cleanCode)) {
        return NextResponse.json({
          success: false,
          alreadyRedeemed: true,
          message: `Kode promo ${cleanCode} sudah pernah kamu gunakan di akun email ${cleanEmail}. Setiap akun hanya dapat menggunakan 1x.`
        }, { status: 400 });
      }
      updatedUser.redeemedCodes.push(cleanCode);
      if (cleanCode === "OS4FREE") {
        updatedUser.activePasses.push({
          type: "pass_3jam_promo",
          expiresAt: Date.now() + 3 * 60 * 60 * 1000 // Exact 3 hours from now
        });
      }
    }

    if (activePass) {
      updatedUser.activePasses.push(activePass);
    }

    userDatabase[cleanEmail] = updatedUser;

    const { isPremium, passExpiresAt } = checkUserPremiumStatus(updatedUser);

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        isPremium,
        passExpiresAt
      }
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
