"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { PropertyFormData, DEFAULT_FORM_DATA } from "@/types/property";
import { PropertyBasicInfo } from "./PropertyBasicInfo";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyFeatures } from "./PropertyFeatures";
import { PropertyImages } from "./PropertyImages";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
}

export function AddPropertyModal({
  isOpen,
  onClose,
  onSubmit
}: AddPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>(DEFAULT_FORM_DATA);

  const handleChange = useCallback((data: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(DEFAULT_FORM_DATA);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold playfair-display-sc">
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            <PropertyBasicInfo formData={formData} onChange={handleChange} />

            <div className="border-t border-border pt-6">
              <PropertyDetails formData={formData} onChange={handleChange} />
            </div>

            <div className="border-t border-border pt-6">
              <PropertyFeatures
                features={formData.features}
                onChange={(features) => handleChange({ features })}
              />
            </div>

            <div className="border-t border-border pt-6">
              <PropertyImages
                images={formData.images}
                onChange={(images) => handleChange({ images })}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
