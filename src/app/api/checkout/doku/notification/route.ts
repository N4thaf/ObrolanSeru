import { NextResponse } from "next/server";

// DOKU Notification Webhook Endpoint
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoiceNumber = body.order?.invoice_number;
    const paymentStatus = body.transaction?.status || body.order?.status;
    const customerEmail = body.customer?.email;

    if (paymentStatus === "SUCCESS" && customerEmail) {
      // Activate VIP Premium Pass in user database for customer email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            isPremium: true,
            activePass: {
              type: "doku_pass",
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 hari VIP
            }
          })
        });
      } catch (e) {}
    }

    return NextResponse.json({ status: "SUCCESS" });
  } catch (error) {
    return NextResponse.json({ status: "FAILED" }, { status: 500 });
  }
}
