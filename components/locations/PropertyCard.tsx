"use client";

import { MapPin, BedDouble, Bath, Square, Trash2 } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  onDelete: (id: string) => void;
}

export function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className="h-48 bg-gradient-to-br from-accent to-muted relative overflow-hidden">
        {property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.images[0].alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {property.listing_type}
          </span>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
            {property.property_type}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
            onClick={() => onDelete(property.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-primary playfair-display-sc mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BedDouble className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Square className="w-4 h-4" />
            <span>{property.area} ft</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              {property.listing_type === "For Rent" ? "per month" : ""}
            </p>
          </div>
          <span className="text-xs px-2 py-1 bg-accent rounded text-accent-foreground font-medium">
            {property.listing_id}
          </span>
        </div>

        {property.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-xs px-2 py-1 text-muted-foreground">
                  +{property.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
