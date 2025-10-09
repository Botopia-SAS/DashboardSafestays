"use client";

import { PropertyFormData, LISTING_TYPES, PROPERTY_TYPES } from "@/types/property";

interface PropertyBasicInfoProps {
  formData: PropertyFormData;
  onChange: (data: Partial<PropertyFormData>) => void;
}

export function PropertyBasicInfo({ formData, onChange }: PropertyBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Listing ID *
        </label>
        <input
          type="text"
          required
          value={formData.listing_id}
          onChange={(e) => onChange({ listing_id: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="PROP-001"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Luxury Apartment in Downtown"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Location *
        </label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Dubai Marina, Dubai"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Listing Type *
        </label>
        <select
          required
          value={formData.listing_type}
          onChange={(e) => onChange({ listing_type: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {LISTING_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Property Type *
        </label>
        <select
          required
          value={formData.property_type}
          onChange={(e) => onChange({ property_type: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-primary mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Beautiful modern apartment with stunning city views..."
        />
      </div>
    </div>
  );
}
