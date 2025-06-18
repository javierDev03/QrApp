import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FurnitureForm from '../components/FurnitureForm';

const FurnitureFormPage = () => {
  const [params] = useSearchParams();
  const qr = params.get('qr');

  return (
    <div className="p-4">
      <FurnitureForm qrCode={qr} />
    </div>
  );
};

export default FurnitureFormPage;