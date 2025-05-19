import { useState, useEffect } from "react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!selectedImage) return null;

  return (
    <div dir="ltr" className="flex w-full h-full">
      {/* الصور المصغرة */}
      <div className="w-24 overflow-y-auto max-h-[350px] pr-2">
        <div className="flex flex-col gap-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index}`}
              onClick={() => setSelectedImage(img)}
              className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                selectedImage === img ? "border-blue-500" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* الصورة الرئيسية */}
      <div className="flex-1 flex justify-center items-center ml-4">
        <img
          src={selectedImage}
          alt="Selected"
          className="max-h-[350px] max-w-full object-contain rounded-lg shadow"
        />
      </div>
    </div>
  );
}
