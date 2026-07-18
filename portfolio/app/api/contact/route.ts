import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(20).max(4000),
});

/**
 * Handles the contact form submission.
 *
 * Currently logs and returns success so the site is fully functional out
 * of the box with zero required environment variables. To send real email,
 * set RESEND_API_KEY and CONTACT_TO_EMAIL in .env and uncomment the Resend
 * call below (add "resend" to package.json dependencies first).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, message } = parsed.data;

  // --- Optional: send via Resend once RESEND_API_KEY is configured ---
  // if (process.env.RESEND_API_KEY) {
  //   const { Resend } = await import("resend");
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "Portfolio <noreply@seye.dev>",
  //     to: process.env.CONTACT_TO_EMAIL!,
  //     replyTo: email,
  //     subject: `New message from ${name}`,
  //     text: message,
  //   });
  // }

  console.log("[contact]", { name, email, messageLength: message.length });

  return NextResponse.json({ ok: true });
}
