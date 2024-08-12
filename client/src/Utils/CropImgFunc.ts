import { Area } from "react-easy-crop";

export const getCroppedImg = (imageSrc: string, pixelCrop: Area) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Cannot get canvas context');
        return;
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toDataURL('image/jpeg', (dataUrl: string) => {
        resolve(dataUrl);
      });
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};

