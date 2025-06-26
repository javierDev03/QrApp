import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { getMuebles } from '../services/firebaseMuebles';
import { auth } from '../firebase';

const QRScanner = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let scanning = true;
    let videoControl;

    const startScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        videoRef.current.srcObject = stream;

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes('back')
        );
        const deviceId = backCamera?.deviceId || devices[0]?.deviceId;
        if (!deviceId) return;

        videoControl = await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, error) => {
          if (result && scanning) {
            scanning = false;
            console.log('✅ Código detectado:', result.getText());
            handleQr(result.getText());
          }
        });
      } catch (err) {
        console.error('❌ Error iniciando cámara:', err);
        alert('❌ No se pudo acceder a la cámara. Asegúrate de aceptar los permisos o revisa en los ajustes del sistema.');
      }
    };

    startScan();

    return () => {
      scanning = false;
      videoControl?.stop();

      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleQr = async (qrCode) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const muebles = await getMuebles(user.uid);
      const limpioQR = qrCode.trim().toLowerCase();
      const existente = muebles.find(
        m => m.numeroSerie?.trim().toLowerCase() === limpioQR
      );

      if (existente) {
        alert('📌 Mueble ya registrado');
        scannerRef.current?.stop?.();
        navigate(`/detalle/${existente.id}`);
      } else {
        scannerRef.current?.stop?.();
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