import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';


interface CropImageProps {
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  src: string;
}

const CropImage: React.FC<CropImageProps> = ({ src, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropChange = useCallback((crop:any) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom:any) => {
    setZoom(zoom);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 400 }}>
      <Cropper
        image={src}
        crop={crop}
        zoom={zoom}
        aspect={1} // Tỉ lệ khung hình, ví dụ 1:1
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
      />
    </div>
  );
};

export default CropImage;
