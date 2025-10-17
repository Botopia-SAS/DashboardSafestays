"use client";

import { useState } from "react";
import { SheetProperty } from "@/types/sheets";
import { X, Save, Home } from "lucide-react";
import { ImageUploadSection } from "./ImageUploadSection";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProperty: SheetProperty) => Promise<void>;
}

const EMPTY_PROPERTY: SheetProperty = {
  code: "",
  available: "Yes",
  location: "",
  date: "",
  month: "6",
  price: "",
  beds: "1",
  baths: "1",
  utilities: "No - Variable",
  mts: "",
  street: "",
  number: "",
  agency: "",
  id: "",
  brochure: "",
  video: "",
  whatsappMessage: "",
  images: "",
  additionalImages: "",
  notes: "",
};

export function AddPropertyModal({
  isOpen,
  onClose,
  onSave,
}: AddPropertyModalProps) {
  const [formData, setFormData] = useState<SheetProperty>(EMPTY_PROPERTY);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar código único
    if (!formData.code.trim()) {
      alert("Please enter a property code");
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      setFormData(EMPTY_PROPERTY); // Reset form
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData(EMPTY_PROPERTY);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 playfair-display-sc">
                Add New Property
              </h2>
              <p className="text-sm text-gray-500 mt-1">Create a new apartment listing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code * <span className="text-xs text-gray-500">(Unique identifier)</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ST_MAL_500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available *
                </label>
                <select
                  name="available"
                  value={formData.available}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Malasaña, Salamanca"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Available
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g., Ago, Dec, nov-15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="€1,500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stay (Months) *
                </label>
                <input
                  type="text"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  placeholder="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Property Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms *
                </label>
                <input
                  type="text"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms *
                </label>
                <input
                  type="text"
                  name="baths"
                  value={formData.baths}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²)
                </label>
                <input
                  type="text"
                  name="mts"
                  value={formData.mts}
                  onChange={handleChange}
                  placeholder="70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilities
              </label>
              <input
                type="text"
                name="utilities"
                value={formData.utilities}
                onChange={handleChange}
                placeholder="No - Variable, Yes, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="Calle del Acuerdo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="23"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agency
              </label>
              <input
                type="text"
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                placeholder="Agency name or contact"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Links & Resources
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idealista Link
                </label>
                <input
                  type="url"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="https://www.idealista.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brochure Link
                </label>
                <input
                  type="url"
                  name="brochure"
                  value={formData.brochure}
                  onChange={handleChange}
                  placeholder="https://safe-stays.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Link
                </label>
                <input
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Property Images
            </h3>

            <ImageUploadSection
              title="Main Images"
              images={formData.images || ""}
              onChange={(imagesJson) =>
                setFormData((prev) => ({ ...prev, images: imagesJson }))
              }
            />

            <ImageUploadSection
              title="Additional Images"
              images={formData.additionalImages || ""}
              onChange={(imagesJson) =>
                setFormData((prev) => ({ ...prev, additionalImages: imagesJson }))
              }
            />
          </div>

          {/* WhatsApp Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              WhatsApp Message
            </h3>
            <div>
              <textarea
                name="whatsappMessage"
                value={formData.whatsappMessage}
                onChange={handleChange}
                rows={4}
                placeholder="Message template with links..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Notes
            </h3>
            <div>
              <textarea
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Creating..." : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
