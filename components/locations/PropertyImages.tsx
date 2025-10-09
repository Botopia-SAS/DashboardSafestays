"use client";

import { memo, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { CloudinaryUpload } from "./CloudinaryUpload";

interface PropertyImagesProps {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const PropertyImages = memo(function PropertyImages({ images, onChange }: PropertyImagesProps) {
  const handleRemoveImage = useCallback((index: number) => {
    onChange(images.filter((_, i) => i !== index));
  }, [images, onChange]);

  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-2">
        Images
      </label>
      
      <div className="mb-4">
        <CloudinaryUpload
          images={images}
          onChange={onChange}
          cloudName={CLOUDINARY_CLOUD_NAME}
          uploadPreset={CLOUDINARY_UPLOAD_PRESET}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Upload up to 10 images. Supported formats: JPG, PNG, WebP
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
