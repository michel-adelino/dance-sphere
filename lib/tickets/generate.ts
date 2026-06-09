import QRCode from "qrcode";
import { nanoid } from "nanoid";

export async function generateTicketCode(eventSlug: string) {
  return `DS-${eventSlug.toUpperCase().slice(0, 8)}-${nanoid(8).toUpperCase()}`;
}

export async function generateQrCode(payload: {
  ticketId: string;
  eventId: string;
  userId: string;
}) {
  const data = JSON.stringify(payload);
  return QRCode.toDataURL(data, {
    width: 256,
    margin: 2,
    color: {
      dark: "#0F0A0E",
      light: "#FAF4F0",
    },
  });
}
