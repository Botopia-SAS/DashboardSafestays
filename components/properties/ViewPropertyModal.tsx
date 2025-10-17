"use client";

import { SheetProperty, parseImagesFromString } from "@/types/sheets";
import { X, MapPin, Calendar, DollarSign, Home, Droplets, Ruler, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ViewPropertyModalProps {
  property: SheetProperty;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewPropertyModal({ property, isOpen, onClose }: ViewPropertyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 playfair-display-sc">
              {property.code}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          {(property.images || property.additionalImages) && (
            <div className="space-y-4">
              {property.images && parseImagesFromString(property.images).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Main Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {parseImagesFromString(property.images).map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={url}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {property.additionalImages && parseImagesFromString(property.additionalImages).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Additional Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {parseImagesFromString(property.additionalImages).map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={url}
                          alt={`Additional image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                property.available.toLowerCase() === "yes"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {property.available === "Yes" ? "✓ Available" : "✗ Not Available"}
            </span>
            {property.date && (
              <span className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                Available from: {property.date}
              </span>
            )}
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{property.price}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Bedrooms</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{property.beds}</p>
            </div>

            <div className="bg-teal-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-teal-700 mb-2">
                <Droplets className="w-5 h-5" />
                <span className="text-sm font-medium">Bathrooms</span>
              </div>
              <p className="text-2xl font-bold text-teal-900">{property.baths}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Address</span>
            </div>
            <p className="text-lg text-gray-900">
              {property.street}
              {property.number && ` ${property.number}`}
            </p>
            <p className="text-sm text-gray-600 mt-1">{property.location}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Minimum Stay
                </label>
                <p className="text-base text-gray-900 mt-1">{property.month} month(s)</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Area
                </label>
                <p className="text-base text-gray-900 mt-1 flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  {property.mts} m²
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Utilities
                </label>
                <p className="text-base text-gray-900 mt-1">{property.utilities || "N/A"}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Agency
                </label>
                <p className="text-base text-gray-900 mt-1">{property.agency || "N/A"}</p>
              </div>

              {property.notes && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Notes
                  </label>
                  <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-3 rounded-lg">
                    {property.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          {(property.id || property.brochure || property.video) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Links & Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {property.id && (
                  <a
                    href={property.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Idealista</span>
                  </a>
                )}

                {property.brochure && (
                  <a
                    href={property.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Brochure</span>
                  </a>
                )}

                {property.video && (
                  <a
                    href={property.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">Video</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp Message */}
          {property.whatsappMessage && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                WhatsApp Message
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {property.whatsappMessage}
                </p>
              </div>
            </div>
          )}

          {/* Agent Tracking */}
          {(property.paulina || property.alessandra || property.laura) && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Agent Tracking
              </h3>
              <div className="flex gap-3">
                {property.paulina && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                    Paulina: {property.paulina}
                  </span>
                )}
                {property.alessandra && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    Alessandra: {property.alessandra}
                  </span>
                )}
                {property.laura && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    Laura: {property.laura}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
