import { stat } from "fs";

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export const getCroppedImg = (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number },) => {
  const img = new Image();
  img.src = imageSrc;

  return new Promise<Blob>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Bruh"))
        throw new Error("Bruh")
      }

      ctx.canvas.height = pixelCrop.height
      ctx.canvas.width = pixelCrop.width

      ctx.drawImage(
        img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height
      )

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Bruh 2"));
          throw new Error("Bruh 2")
        }

        resolve(blob)

      }, "image/jpeg")
    }
    img.onerror = () => {

      reject(new Error("Bruh 3"))
    }
  })
}

export const getColorBasedOnPublishStatus = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "green";
    case "SCHEDULED":
      return "yellow";
    case "UPDATED":
      return "cyan";
    default:
      return "red";
  }
}
