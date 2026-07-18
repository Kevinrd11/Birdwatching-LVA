import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Color de fondo del recuerdo (igual al del bloque ShareableTourSummary), para
// que el relleno de la exportación combine con el diseño y no aparezcan bordes.
const SUMMARY_BACKGROUND = '#07180f';

// Espera a que las fuentes web y todas las imágenes del nodo estén realmente
// cargadas y decodificadas. Sin esto, html-to-image puede capturar un cuadro
// incompleto o "descolorido" (un problema frecuente en Safari/iOS).
async function waitForAssets(node: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    } catch {
      // Si la API de fuentes falla, seguimos igual.
    }
  }

  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    })
  );

  // decode() asegura que el bitmap esté listo antes de rasterizar el nodo.
  await Promise.all(
    images.map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve()))
  );
}

// Opciones de captura: fondo sólido, alta resolución y sin transformaciones
// heredadas que distorsionen el render.
function captureOptions(node: HTMLElement) {
  return {
    cacheBust: true,
    pixelRatio: 3,
    backgroundColor: SUMMARY_BACKGROUND,
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', margin: '0' },
  } as const;
}

// html-to-image puede devolver una primera captura incompleta (imágenes o
// estilos aún sin aplicar). Renderizamos varias veces de "calentamiento" y
// usamos la última, que es la fiable, garantizando que lo descargado se vea
// igual que en pantalla.
async function renderPng(node: HTMLElement): Promise<string> {
  await waitForAssets(node);
  const options = captureOptions(node);
  let dataUrl = '';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    dataUrl = await toPng(node, options);
  }
  return dataUrl;
}

function triggerDownload(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Exporta el nodo como imagen PNG y dispara la descarga. */
export async function exportSummaryAsImage(
  node: HTMLElement,
  fileName = 'birdwatching-lva.png'
): Promise<void> {
  const dataUrl = await renderPng(node);
  triggerDownload(dataUrl, fileName);
}

/** Exporta el nodo como PDF (PNG embebido a tamaño del bloque) y descarga. */
export async function exportSummaryAsPdf(
  node: HTMLElement,
  fileName = 'birdwatching-lva.pdf'
): Promise<void> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;
  const dataUrl = await renderPng(node);

  const pdf = new jsPDF({
    orientation: width >= height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(fileName);
}
