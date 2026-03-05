import * as functions from "firebase-functions";
import { Resend } from "resend";
import { buildConfirmedEmail, buildRejectedEmail } from "./email-templates";

// ─── Resend client (lazy-initialised) ───────────────────────────────────────
// The API key is injected at runtime via Firebase secrets.
// Set it once:  firebase functions:secrets:set RESEND_API_KEY
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// The "from" address must be a verified domain/sender in your Resend dashboard.
// For testing you can use: "onboarding@resend.dev"
const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "Taaza Restaurant <onboarding@resend.dev>";

// ─── Firestore trigger ─────────────────────────────────────────────────────
export const onReservationStatusChange = functions
  .runWith({ secrets: ["RESEND_API_KEY"] })
  .firestore.document("reservation/{reservationId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only send email when the status actually changed
    if (before.status === after.status) {
      functions.logger.info("Status unchanged – skipping email.");
      return null;
    }

    const newStatus: string = after.status;

    // We only care about confirmed / rejected transitions
    if (newStatus !== "confirmed" && newStatus !== "rejected") {
      functions.logger.info(`Status changed to "${newStatus}" – no email needed.`);
      return null;
    }

    const customerEmail: string | undefined = after.email;
    const customerName: string = after.name ?? "Guest";

    if (!customerEmail) {
      functions.logger.warn("No email on reservation – cannot notify.");
      return null;
    }

    // Build the right email
    const reservationDate: string = after.date ?? "";
    const reservationTime: string = after.time ?? "";
    const guests: number = after.guests ?? 1;
    const rejectionReason: string | undefined = after.rejectionReason;

    const subject =
      newStatus === "confirmed"
        ? "🎉 Your Reservation at Taaza is Confirmed!"
        : "Reservation Update – Taaza Restaurant";

    const html =
      newStatus === "confirmed"
        ? buildConfirmedEmail({ customerName, reservationDate, reservationTime, guests })
        : buildRejectedEmail({ customerName, reservationDate, reservationTime, guests, rejectionReason });

    // Send via Resend
    try {
      const { data, error } = await getResend().emails.send({
        from: FROM_ADDRESS,
        to: [customerEmail],
        subject,
        html,
      });

      if (error) {
        functions.logger.error("Resend API error:", error);
        return null;
      }

      functions.logger.info(
        `Email sent to ${customerEmail} (status: ${newStatus}, id: ${data?.id})`
      );
    } catch (err) {
      functions.logger.error("Failed to send email:", err);
    }

    return null;
  });
