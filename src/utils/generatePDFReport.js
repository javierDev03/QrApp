import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';

export async function generatePDFReport(muebles = []) {
  // Cargar la hoja membretada desde /public
  const existingPdfBytes = await fetch('/Hoja Membretada.pdf').then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const [templatePage] = pdfDoc.getPages();
  const { width, height } = templatePage.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = height - 180; // Espaciado desde arriba (ajustable según el membrete)

  // Título
  templatePage.drawText('Reporte de Muebles', {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 25;

  // Dibujar los datos de los muebles
  muebles.forEach((mueble, i) => {
    const text = `#${i + 1} | Serie: ${mueble.numeroSerie} | Tipo: ${mueble.tipo} | Ubicación: ${mueble.ubicacion}`;
    templatePage.drawText(text, {
      x: 50,
      y,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 15;

    if (y < 80 && i < muebles.length - 1) {
      const newPage = pdfDoc.addPage([width, height]);
      newPage.drawPage(templatePage); // duplicar fondo si quieres mantener membrete
      y = height - 100;
    }
  });

  const pdfBytes = await pdfDoc.save();

 const base64Data = await convertToBase64(pdfBytes);

async function convertToBase64(buffer) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.readAsDataURL(new Blob([buffer]));
  });
}

await Filesystem.writeFile({
  path: 'reporte-inventario.pdf',
  data: base64Data,
  directory: Directory.Downloads,
  recursive: true
});

  alert('PDF guardado en la carpeta Descargas como "reporte-inventario.pdf".');

  console.log('PDF guardado correctamente en Documentos');
}
