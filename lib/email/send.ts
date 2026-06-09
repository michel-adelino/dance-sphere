// Email sending is disabled until Resend is configured.
// Uncomment the Resend block below and set RESEND_API_KEY + EMAIL_FROM in .env
//
// import { Resend } from "resend";
//
// function getResend() {
//   if (!process.env.RESEND_API_KEY) return null;
//   return new Resend(process.env.RESEND_API_KEY);
// }

export type EmailSendResult = {
  sent: boolean;
  mocked: boolean;
  to: string;
};

export async function sendTicketConfirmationEmail({
  to,
  eventTitle,
  eventDate,
  eventLocation,
  tickets,
}: {
  to: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: { ticketCode: string; qrCode: string }[];
}): Promise<EmailSendResult> {
  // Mock: pretend the email was sent so the booking flow and UI stay complete.
  console.info("[email:mock] Ticket confirmation email", {
    to,
    eventTitle,
    eventDate,
    eventLocation,
    ticketCount: tickets.length,
  });

  // --- Resend integration (enable when ready) ---
  // const resend = getResend();
  // if (!resend) {
  //   console.warn("RESEND_API_KEY not set, skipping email");
  //   return { sent: false, mocked: true, to };
  // }
  //
  // const ticketRows = tickets
  //   .map(
  //     (t) => `
  //     <tr>
  //       <td style="padding:12px;border-bottom:1px solid #241A22;color:#FAF4F0;">${t.ticketCode}</td>
  //       <td style="padding:12px;border-bottom:1px solid #241A22;text-align:center;">
  //         <img src="${t.qrCode}" alt="QR Code" width="120" height="120" />
  //       </td>
  //     </tr>`
  //   )
  //   .join("");
  //
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM || "DanceSphere <onboarding@resend.dev>",
  //   to,
  //   subject: `Your tickets for ${eventTitle}`,
  //   html: `...`,
  // });
  //
  // return { sent: true, mocked: false, to };

  return { sent: true, mocked: true, to };
}
