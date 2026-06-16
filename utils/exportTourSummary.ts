import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Opciones comunes para capturar el recuerdo digital con buena nitidez y un
// fondo sólido (evita transparencias y artefactos en la exportación).
function captureOptions(node: HTMLElement) {
  return {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    width: node.offsetWidth,
    height: node.offsetHeight,
  } as const;
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
  const dataUrl = await toPng(node, captureOptions(node));
  triggerDownload(dataUrl, fileName);
}

/** Exporta el nodo como PDF (PNG embebido a tamaño del bloque) y descarga. */
export async function exportSummaryAsPdf(
  node: HTMLElement,
  fileName = 'birdwatching-lva.pdf'
): Promise<void> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;
  const dataUrl = await toPng(node, captureOptions(node));

  const pdf = new jsPDF({
    orientation: width >= height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(fileName);
}
