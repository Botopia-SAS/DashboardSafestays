export interface PropertyImage {
  url: string;
  alt: string;
  order: number;
}

export interface Property {
  id: string;
  listing_id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  listing_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  agency_fee: number;
  images: PropertyImage[];
  features: string[];
  created_at: string;
  updated_at?: string;
}

export interface PropertyFormData {
  listing_id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  listing_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  agency_fee: number;
  images: PropertyImage[];
  features: string[];
}

export const LISTING_TYPES = ["For Rent", "For Sale"] as const;
export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Studio",
  "Penthouse",
  "Townhouse",
] as const;

export const DEFAULT_FORM_DATA: PropertyFormData = {
  listing_id: "",
  title: "",
  description: "",
  price: 0,
  area: 0,
  location: "",
  listing_type: "For Rent",
  property_type: "Apartment",
  bedrooms: 1,
  bathrooms: 1,
  agency_fee: 0,
  images: [],
  features: [],
};
