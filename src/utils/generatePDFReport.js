import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';

export async function generatePDFReport(muebles = []) {
  console.log('📥 Iniciando generación de PDF con', muebles.length, 'muebles');
  const doc = new jsPDF();

  // Cargar imagen de fondo como base64
  const img = await loadImageBase64('/Hoja-Membretada.png');
  console.log('🖼️ Imagen de membrete cargada correctamente');

  // Dibujar el membrete en la primera página antes de la tabla
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
    margin: { bottom: 40 },
    willDrawCell: function (data) {
      if (
        data.row.raw === undefined &&
        doc.internal.getCurrentPageInfo().pageNumber > 1 &&
        !doc.__membreteAdded
      ) {
        doc.addImage(img, 'PNG', 0, 0, 210, 297);
        doc.__membreteAdded = true;
      }
    },
    didDrawPage: function () {
      doc.__membreteAdded = false;
    }
  });
  console.log('📄 Tabla generada correctamente');

  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  if (Capacitor.isNativePlatform()) {
    try {
      console.log('📱 Plataforma nativa detectada, guardando archivo...');
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(pdfBlob);
      });

      const writeResult = await Filesystem.writeFile({
        path: 'reporte-inventario.pdf',
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      const fileInfo = await Filesystem.getUri({
        path: 'reporte-inventario.pdf',
        directory: Directory.Documents,
      });

      if (!fileInfo || !fileInfo.uri) {
        throw new Error('No se pudo obtener la URI del archivo PDF');
      }

      console.log('✅ PDF guardado en:', fileInfo.uri);
      alert('✅ PDF guardado correctamente en la carpeta Documentos');

      // await Browser.open({ url: fileInfo.uri });
    } catch (error) {
      console.error('❌ Error al guardar o abrir el PDF:', error);
      alert('❌ No se pudo guardar el archivo. Verifica permisos o almacenamiento.');
    }
  } else {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'reporte-inventario.pdf';
    a.click();
    console.log('✅ Descarga del PDF disparada en web');
  }
}

async function loadImageBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  }).catch((err) => {
    console.error('❌ Error al cargar la imagen de membrete:', err);
  });
}
