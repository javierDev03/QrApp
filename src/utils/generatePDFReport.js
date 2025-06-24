import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePDFReport(muebles = []) {
  const doc = new jsPDF();

  // Cargar imagen de fondo como base64
  const img = await loadImageBase64('/Hoja-Membretada.png');

  // Dibujar imagen como fondo (A4: 210mm x 297mm)
  doc.addImage(img, 'PNG', 0, 0, 210, 297);

  // Crear tabla de contenido
  autoTable(doc, {
    startY: 60,
    head: [['No.', 'Serie', 'Tipo', 'Ubicación', 'Marca', 'Fecha de Registro']],
    body: muebles.map((m, i) => [
      i + 1,
      m.numeroSerie || '',
      m.tipo || '',
      m.ubicacion || '',
      m.marca || '',
      m.fechaRegistro || ''
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
      halign: 'center'
    },
    theme: 'grid',
    margin: { bottom: 40 }, // para evitar tapar el membrete inferior
   
  });

  // Descargar el PDF
  doc.save('reporte-inventario.pdf');
}

async function loadImageBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
