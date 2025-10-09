import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Property, PropertyFormData } from "@/types/property";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProperties(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch properties";
      setError(errorMessage);
      console.error("Error fetching properties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async (formData: PropertyFormData) => {
    try {
      const { data, error: insertError } = await supabase
        .from("properties")
        .insert([{
          listing_id: formData.listing_id,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          area: formData.area,
          location: formData.location,
          listing_type: formData.listing_type,
          property_type: formData.property_type,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          agency_fee: formData.agency_fee,
          images: formData.images,
          features: formData.features,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      setProperties([data, ...properties]);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add property";
      console.error("Error adding property:", err);
      return { success: false, error: errorMessage };
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setProperties(properties.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete property";
      console.error("Error deleting property:", err);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    addProperty,
    deleteProperty,
    refetch: fetchProperties,
  };
}
