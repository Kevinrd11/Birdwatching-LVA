'use client';

export default function PrintButton({ label = 'Imprimir comprobante' }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-full bg-emerald-950 px-5 py-3 font-black text-white">
      {label}
    </button>
  );
}

