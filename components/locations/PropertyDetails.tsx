"use client";

import { PropertyFormData } from "@/types/property";

interface PropertyDetailsProps {
  formData: PropertyFormData;
  onChange: (data: Partial<PropertyFormData>) => void;
}

export function PropertyDetails({ formData, onChange }: PropertyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Price (AED) *
        </label>
        <input
          type="number"
          required
          step="0.01"
          value={formData.price}
          onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="2500.00"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Area (sq ft)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.area}
          onChange={(e) => onChange({ area: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="850.50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Bedrooms
        </label>
        <input
          type="number"
          value={formData.bedrooms}
          onChange={(e) => onChange({ bedrooms: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="2"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Bathrooms
        </label>
        <input
          type="number"
          value={formData.bathrooms}
          onChange={(e) => onChange({ bathrooms: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="2"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Agency Fee (AED)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.agency_fee}
          onChange={(e) => onChange({ agency_fee: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="125.00"
        />
      </div>
    </div>
  );
}
