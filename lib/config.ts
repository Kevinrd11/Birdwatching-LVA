// Configuración central del sitio.
// Única fuente de verdad para datos de contacto y enlaces externos.
// TODO: reemplazar los valores de placeholder por los datos reales del negocio.

export const siteConfig = {
  name: 'La Vieja Adventures',
  location: 'Sucre, San Carlos, Alajuela, Costa Rica',
  // Número en formato internacional sin "+" ni espacios (para enlaces wa.me).
  whatsappNumber: '50684519537',
  // Versión legible para mostrar en pantalla.
  phoneDisplay: '+506 8451-9537',
  email: 'info@lavieja-adventures.com',
  url: 'https://lavieja-adventures.com',
} as const;

/**
 * Construye un enlace de WhatsApp con un mensaje pre-rellenado.
 */
export function whatsappLink(message: string, phone: string = siteConfig.whatsappNumber): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
