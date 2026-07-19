import type { EmailTemplateId, ReservationRecord } from '@/types/reservation';
import { formatLongDate } from './dates';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const templateTitles: Record<EmailTemplateId, string> = {
  reservation_received: 'Reserva recibida',
  reservation_confirmed: 'Reserva confirmada',
  payment_received: 'Pago recibido',
  payment_pending: 'Pago pendiente',
  reservation_cancelled: 'Reserva cancelada',
  tour_reminder: 'Recordatorio antes del tour',
  refund_processed: 'Reembolso realizado',
};

function money(value: number, currency: string): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildReservationEmail(templateId: EmailTemplateId, reservation: ReservationRecord): EmailPayload {
  const title = templateTitles[templateId];
  const date = formatLongDate(reservation.date);
  const subject = `${title}: ${reservation.reservationCode}`;
  const text = [
    title,
    `Código: ${reservation.reservationCode}`,
    `Cliente: ${reservation.customerName}`,
    `Experiencia: ${reservation.packageName}`,
    `Fecha: ${date}`,
    `Horario: ${reservation.startTime} - ${reservation.endTime}`,
    `Participantes: ${reservation.totalParticipants}`,
    `Estado de pago: ${reservation.paymentStatus}`,
    `Total: ${money(reservation.total, reservation.currency)}`,
    `Pagado: ${money(reservation.paidAmount, reservation.currency)}`,
    `Saldo pendiente: ${money(reservation.pendingAmount, reservation.currency)}`,
    'Indicaciones: llegar 15 minutos antes, usar zapatos cerrados y ropa de colores naturales.',
    'Contacto: WhatsApp +506 8451-9537',
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8f3e8;padding:24px;color:#07180f">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d9e4d6">
        <div style="background:#07180f;color:#f8f3e8;padding:24px">
          <p style="margin:0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#d9ab53">${title}</p>
          <h1 style="margin:8px 0 0;font-size:28px">Código ${reservation.reservationCode}</h1>
        </div>
        <div style="padding:24px">
          <p>Hola ${reservation.customerName}, esta es la información de tu reserva.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td><strong>Experiencia</strong></td><td>${reservation.packageName}</td></tr>
            <tr><td><strong>Fecha</strong></td><td>${date}</td></tr>
            <tr><td><strong>Horario</strong></td><td>${reservation.startTime} - ${reservation.endTime}</td></tr>
            <tr><td><strong>Participantes</strong></td><td>${reservation.totalParticipants}</td></tr>
            <tr><td><strong>Estado de pago</strong></td><td>${reservation.paymentStatus}</td></tr>
            <tr><td><strong>Total</strong></td><td>${money(reservation.total, reservation.currency)}</td></tr>
            <tr><td><strong>Pagado</strong></td><td>${money(reservation.paidAmount, reservation.currency)}</td></tr>
            <tr><td><strong>Saldo pendiente</strong></td><td>${money(reservation.pendingAmount, reservation.currency)}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#edf3e6;border-radius:14px">
            <strong>Qué llevar</strong>
            <p style="margin:8px 0 0">Zapatos cerrados, ropa cómoda de colores naturales, agua, impermeable ligero, repelente, binoculares y cámara si deseas.</p>
          </div>
          <p style="margin-top:20px">Para cambios o consultas, escribinos por WhatsApp al +506 8451-9537.</p>
        </div>
      </div>
    </div>
  `;

  return { to: reservation.customerEmail, subject, html, text };
}

export async function sendReservationEmail(templateId: EmailTemplateId, reservation: ReservationRecord): Promise<{ ok: boolean; message: string }> {
  const payload = buildReservationEmail(templateId, reservation);
  console.info('[reservation-email]', {
    to: payload.to,
    subject: payload.subject,
    reservationCode: reservation.reservationCode,
    templateId,
  });
  return { ok: true, message: 'Correo preparado para envío por proveedor SMTP/transaccional.' };
}

