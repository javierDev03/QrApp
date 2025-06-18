import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { getMuebles } from '../services/db';

const QRScanner = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      result => {
        console.log('✅ QR detectado:', result.data);
        handleQr(result.data);
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    scannerRef.current = scanner;
    scanner.start();

    return () => scanner.stop();
  }, []);

  const handleQr = async (qrCode) => {
    try {
      const muebles = await getMuebles();
      const limpioQR = qrCode.trim().toLowerCase();
      const existente = muebles.find(
        m => m.numeroSerie?.trim().toLowerCase() === limpioQR
      );

      if (existente) {
        alert('📌 Mueble ya registrado');
        scannerRef.current?.stop?.(); // solo si existe
        navigate(`/detalle/${existente.id}`);
      } else {
        scannerRef.current?.stop?.(); // solo si existe
        navigate(`/registrar?qr=${encodeURIComponent(qrCode)}`);
      }
    } catch (error) {
      console.error('❌ Error al procesar el QR:', error);
    }
  };

  const isWeb = true;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      {isWeb && (
        <video ref={videoRef} className="w-full max-w-md rounded-lg" />
      )}
    
    </div>
  );
};

export default QRScanner;