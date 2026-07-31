import { NextResponse } from "next/server";
import crypto from "crypto";

// DOKU Jokul Credentials (Set in Vercel Environment Variables)
const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || "";
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || "";
const DOKU_IS_PRODUCTION = process.env.DOKU_IS_PRODUCTION === "true";

const DOKU_BASE_URL = DOKU_IS_PRODUCTION
  ? "https://api.doku.com"
  : "https://api-sandbox.doku.com";

// Helper to generate DOKU Signature (HMAC-SHA256)
function generateDokuSignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  digest: string,
  secretKey: string
) {
  const componentToSign =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${requestTimestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  return crypto
    .createHmac("sha256", secretKey)
    .update(componentToSign)
    .digest("base64");
}

export async function POST(req: Request) {
  try {
    const { passId, passName, amount, userEmail, userName } = await req.json();

    if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "DOKU Credentials belum dikonfigurasi di Vercel Environment Variables.",
        },
        { status: 400 }
      );
    }

    const invoiceNumber = `OS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const requestId = crypto.randomUUID();
    const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z";
    const requestTarget = "/checkout/v1/payment";

    const payload = {
      order: {
        invoice_number: invoiceNumber,
        amount: amount,
        line_items: [
          {
            name: passName || "Pass ObrolanSeru",
            price: amount,
            quantity: 1,
          },
        ],
      },
      payment: {
        payment_due_date: 60, // 60 menit batas waktu bayar QRIS/VA
      },
      customer: {
        name: userName || "Pemain ObrolanSeru",
        email: userEmail || "pemain@obrolanseru.com",
      },
    };

    const jsonPayload = JSON.stringify(payload);
    const digest = crypto
      .createHash("sha256")
      .update(jsonPayload)
      .digest("base64");

    const signature = generateDokuSignature(
      DOKU_CLIENT_ID,
      requestId,
      requestTimestamp,
      requestTarget,
      digest,
      DOKU_SECRET_KEY
    );

    const dokuRes = await fetch(`${DOKU_BASE_URL}${requestTarget}`, {
      method: "POST",
      headers: {
        "Client-Id": DOKU_CLIENT_ID,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        "Signature": `HMACSHA256=${signature}`,
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const dokuData = await dokuRes.json();

    if (dokuRes.ok && dokuData.response?.payment?.url) {
      return NextResponse.json({
        success: true,
        paymentUrl: dokuData.response.payment.url,
        invoiceNumber,
      });
    }

    const errorMessage =
      dokuData?.error?.message ||
      dokuData?.message ||
      (typeof dokuData === "object" ? JSON.stringify(dokuData) : "Gagal membuat transaksi DOKU");

    return NextResponse.json(
      {
        success: false,
        message: `DOKU Error: ${errorMessage}`,
        details: dokuData,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
