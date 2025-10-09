"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyCard } from "@/components/locations/PropertyCard";
import { AddPropertyModal } from "@/components/locations/AddPropertyModal";
import { Property, PropertyFormData } from "@/types/property";
import { getProperties, createProperty, deleteProperty } from "./actions";

export default function LocationsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (formData: PropertyFormData) => {
    setSubmitting(true);
    try {
      const result = await createProperty(formData);

      if (result.success) {
        await loadProperties();
        setIsModalOpen(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Error al agregar la propiedad");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta propiedad?")) return;

    try {
      const result = await deleteProperty(id);

      if (result.success) {
        await loadProperties();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error al eliminar la propiedad");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary playfair-display-sc">
              Locations
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your luxury properties ({properties.length})
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-border">
            <p className="text-muted-foreground mb-4 text-lg">
              No properties yet. Start by adding your first luxury property.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDeleteProperty}
              />
            ))}
          </div>
        )}

        <AddPropertyModal
          isOpen={isModalOpen}
          onClose={() => !submitting && setIsModalOpen(false)}
          onSubmit={handleAddProperty}
        />
      </div>
    </DashboardLayout>
  );
}
