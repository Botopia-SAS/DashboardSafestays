"use client";

import { useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import { PropertyImage } from "@/types/property";

interface CloudinaryUploadProps {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
  cloudName: string;
  uploadPreset: string;
}

interface CloudinaryWidget {
  open: () => void;
}

interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
    original_filename: string;
  };
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: {
          cloudName: string;
          uploadPreset: string;
          sources: string[];
          multiple: boolean;
          maxFiles: number;
          folder: string;
        },
        callback: (error: Error | null, result: CloudinaryResult) => void
      ) => CloudinaryWidget;
    };
  }
}

export function CloudinaryUpload({ 
  images, 
  onChange, 
  cloudName, 
  uploadPreset 
}: CloudinaryUploadProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: 10,
          folder: "safestays/properties",
        },
        (error, result) => {
          if (error) {
            console.error("Upload error:", error);
            return;
          }

          if (result.event === "success") {
            const newImage: PropertyImage = {
              url: result.info.secure_url,
              alt: result.info.original_filename || "Property image",
              order: images.length + 1,
            };
            onChange([...images, newImage]);
          }
        }
      );
    }
  }, [cloudName, uploadPreset, images, onChange]);

  const handleOpenWidget = () => {
    widgetRef.current?.open();
  };

  return (
    <button
      type="button"
      onClick={handleOpenWidget}
      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
    >
      <Upload className="w-4 h-4" />
      Upload Images
    </button>
  );
}
