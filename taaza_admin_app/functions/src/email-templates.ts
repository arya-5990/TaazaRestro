// ─── Email HTML Templates for Taaza Restaurant ─────────────────────────────

interface ConfirmedParams {
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
}

interface RejectedParams {
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  rejectionReason?: string;
}

// ─── Shared styles ─────────────────────────────────────────────────────────
const COLORS = {
  black: "#0C0B08",
  charcoal: "#1A1916",
  gold: "#D4AF37",
  softGold: "#E5C86C",
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  green: "#4CAF50",
  red: "#D32F2F",
};

function baseWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${COLORS.black};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.black};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
             style="background-color:${COLORS.charcoal};border-radius:16px;overflow:hidden;border:1px solid rgba(212,175,55,0.15);">
        <!-- Gold header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,${COLORS.gold},${COLORS.softGold});padding:28px 32px;">
            <h1 style="margin:0;font-size:26px;color:${COLORS.black};font-weight:700;letter-spacing:0.5px;">
              TAAZA
            </h1>
            <p style="margin:4px 0 0;font-size:12px;color:${COLORS.charcoal};text-transform:uppercase;letter-spacing:2px;">
              Fine Dining Experience
            </p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(212,175,55,0.1);">
            <p style="margin:0;font-size:11px;color:rgba(245,245,245,0.35);text-align:center;">
              Taaza Restaurant &bull; Premium Dining<br/>
              This is an automated message. Please do not reply directly.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Confirmed ─────────────────────────────────────────────────────────────
export function buildConfirmedEmail(p: ConfirmedParams): string {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:rgba(76,175,80,0.12);line-height:56px;font-size:28px;">
        ✓
      </div>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:${COLORS.green};text-align:center;">
      Reservation Confirmed
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:${COLORS.offWhite};text-align:center;opacity:0.7;">
      Great news, <strong style="color:${COLORS.white};">${p.customerName}</strong>! Your table is reserved.
    </p>

    <!-- Details card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:${COLORS.black};border-radius:12px;border:1px solid rgba(212,175,55,0.12);">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Date</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.reservationDate}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Time</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.reservationTime}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Guests</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.guests} Guest${p.guests > 1 ? "s" : ""}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:13px;color:${COLORS.offWhite};text-align:center;opacity:0.55;">
      We look forward to welcoming you. If you need to modify your reservation,<br/>
      please call us directly.
    </p>
  `;
  return baseWrapper(content);
}

// ─── Rejected ──────────────────────────────────────────────────────────────
export function buildRejectedEmail(p: RejectedParams): string {
  const reasonBlock = p.rejectionReason
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="margin-top:16px;background-color:rgba(211,47,47,0.06);border-radius:10px;border:1px solid rgba(211,47,47,0.15);">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:11px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Reason</p>
          <p style="margin:0;font-size:14px;color:${COLORS.offWhite};">${p.rejectionReason}</p>
        </td></tr>
      </table>`
    : "";

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:rgba(211,47,47,0.12);line-height:56px;font-size:28px;">
        ✕
      </div>
    </div>
    <h2 style="margin:0 0 8px;font-size:22px;color:${COLORS.red};text-align:center;">
      Reservation Could Not Be Accommodated
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:${COLORS.offWhite};text-align:center;opacity:0.7;">
      Hello <strong style="color:${COLORS.white};">${p.customerName}</strong>, unfortunately we are unable to
      honour your reservation request at this time.
    </p>

    <!-- Details card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:${COLORS.black};border-radius:12px;border:1px solid rgba(212,175,55,0.12);">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Date</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.reservationDate}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Time</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.reservationTime}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:12px;color:rgba(245,245,245,0.45);text-transform:uppercase;letter-spacing:1px;">Guests</td>
              <td style="padding:8px 0;font-size:14px;color:${COLORS.white};text-align:right;">${p.guests} Guest${p.guests > 1 ? "s" : ""}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${reasonBlock}

    <p style="margin:24px 0 0;font-size:13px;color:${COLORS.offWhite};text-align:center;opacity:0.55;">
      We apologise for any inconvenience. Please feel free to try a different date or time,<br/>
      or call us for assistance.
    </p>
  `;
  return baseWrapper(content);
}
