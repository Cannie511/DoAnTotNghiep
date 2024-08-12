'use client'
import React, { useState } from 'react';
import CropImage from './test1';
import { Area } from 'react-easy-crop';
import { getCroppedImg } from '../Utils/CropImgFunc'; 

const Apptest: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
  if (imageSrc && croppedAreaPixels) {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  } else {
    console.error('Image source or crop area is missing');
  }
};

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && (
        <>
          <CropImage src={imageSrc} onCropComplete={onCropComplete} />
          <button className="bg-slate-400 rounded-lg" onClick={handleCrop}>Crop Image</button>
        </>
      )}
      {croppedImage && (
        <div>
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
      {croppedImage}
    </div>
  );
};

export default Apptest;

