"use client";

import { useState, memo, useCallback } from "react";
import { Plus, X } from "lucide-react";

interface PropertyFeaturesProps {
  features: string[];
  onChange: (features: string[]) => void;
}

export const PropertyFeatures = memo(function PropertyFeatures({ features, onChange }: PropertyFeaturesProps) {
  const [newFeature, setNewFeature] = useState("");

  const handleAddFeature = useCallback(() => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature("");
    }
  }, [newFeature, features, onChange]);

  const handleRemoveFeature = useCallback((index: number) => {
    onChange(features.filter((_, i) => i !== index));
  }, [features, onChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  }, [handleAddFeature]);

  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-2">
        Features
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Air Conditioning"
        />
        <button
          type="button"
          onClick={handleAddFeature}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            <span>{feature}</span>
            <button
              type="button"
              onClick={() => handleRemoveFeature(index)}
              className="hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
