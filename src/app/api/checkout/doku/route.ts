import { NextResponse } from "next/server";
import crypto from "crypto";

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

    const clientId = (process.env.DOKU_CLIENT_ID || "").trim();
    const secretKey = (process.env.DOKU_SECRET_KEY || "").trim();
    const isProduction = process.env.DOKU_IS_PRODUCTION === "true";

    if (!clientId || !secretKey) {
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
        payment_due_date: 60,
        payment_url_redirect: true,
        callback_url: `https://obrolanseru.com/store?status=success&email=${encodeURIComponent(userEmail)}&passId=${encodeURIComponent(passId)}`,
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
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      digest,
      secretKey
    );

    // Try primary base URL first, then fallback if environment mismatch occurs
    const primaryUrl = isProduction ? "https://api.doku.com" : "https://api-sandbox.doku.com";
    const fallbackUrl = isProduction ? "https://api-sandbox.doku.com" : "https://api.doku.com";

    let dokuRes = await fetch(`${primaryUrl}${requestTarget}`, {
      method: "POST",
      headers: {
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        "Signature": `HMACSHA256=${signature}`,
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    let dokuData = await dokuRes.json();

    // Auto retry with fallback URL if DOKU returns Invalid Client-Id due to Sandbox/Production mismatch
    if (!dokuRes.ok && (dokuData?.error?.message?.includes("Client-Id") || dokuData?.message?.includes("Client-Id"))) {
      dokuRes = await fetch(`${fallbackUrl}${requestTarget}`, {
        method: "POST",
        headers: {
          "Client-Id": clientId,
          "Request-Id": requestId,
          "Request-Timestamp": requestTimestamp,
          "Signature": `HMACSHA256=${signature}`,
          "Content-Type": "application/json",
        },
        body: jsonPayload,
      });
      dokuData = await dokuRes.json();
    }

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
