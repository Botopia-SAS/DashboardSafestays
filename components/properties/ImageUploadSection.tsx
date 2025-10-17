"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { parseImagesFromString, stringifyImages } from "@/types/sheets";

interface ImageUploadSectionProps {
  title: string;
  images: string;
  onChange: (imagesJson: string) => void;
  cloudName?: string;
  uploadPreset?: string;
}

export function ImageUploadSection({
  title,
  images,
  onChange,
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
}: ImageUploadSectionProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsear URLs desde el string JSON
  useEffect(() => {
    const urls = parseImagesFromString(images);
    setImageUrls(urls);
  }, [images]);

  const handleRemoveImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    onChange(stringifyImages(updatedUrls));
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (files.length > 0) {
      uploadFilesToCloudinary(files);
    }
  };

  // File input handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFilesToCloudinary(Array.from(files));
    }
  };

  // Upload multiple files to Cloudinary
  const uploadFilesToCloudinary = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let completed = 0;

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "safestays/properties");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
        return data.secure_url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      onChange(stringifyImages(updatedUrls));
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading some images. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {title}
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Beautiful Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02]"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        {imageUrls.length === 0 ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <Upload className="relative w-16 h-16 text-blue-500 mx-auto" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Images & Videos"}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG, GIF, WEBP, MP4, MOV (max 10MB each)
              </p>
            </div>

            {isUploading && (
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Upload className="w-5 h-5" />
                {isUploading ? "Uploading..." : "Choose Files"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                onClick={(e) => e.stopPropagation()}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl transition-all hover:scale-105"
              >
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                  #{index + 1}
                </div>
              </div>
            ))}

            {/* Add more button - Beautiful Card */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              disabled={isUploading}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-blue-500 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 hover:opacity-20 transition-opacity"></div>
                <Plus className="relative w-10 h-10" />
              </div>
              <span className="text-sm font-semibold">Add More</span>
            </button>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <p className="text-gray-600 font-medium">
            {imageUrls.length} file{imageUrls.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        {isUploading && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <p className="text-blue-600 font-semibold">
              Uploading {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
