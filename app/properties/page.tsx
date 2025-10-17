"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, Eye, Pencil, Trash2, Search, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SheetProperty } from "@/types/sheets";
import { ViewPropertyModal } from "@/components/properties/ViewPropertyModal";
import { EditPropertyModal } from "@/components/properties/EditPropertyModal";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<SheetProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SheetProperty | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterBeds, setFilterBeds] = useState("all");
  const [filterBaths, setFilterBaths] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sheets");
      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
      } else {
        console.error("Error:", result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      alert("Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const handleView = (property: SheetProperty) => {
    setSelectedProperty(property);
    setViewModalOpen(true);
  };

  const handleEdit = (property: SheetProperty) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleSave = async (updatedProperty: SheetProperty) => {
    try {
      const response = await fetch(`/api/sheets/${updatedProperty.code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProperty),
      });

      const result = await response.json();

      if (result.success) {
        alert("Property updated successfully!");
        await loadProperties();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Error updating property");
    }
  };

  const handleAddProperty = async (newProperty: SheetProperty) => {
    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProperty),
      });

      const result = await response.json();

      if (result.success) {
        alert("Property created successfully!");
        await loadProperties();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Error adding property");
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`¿Estás seguro de eliminar la propiedad ${code}?`)) return;

    try {
      const response = await fetch(`/api/sheets/${code}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Propiedad eliminada exitosamente");
        await loadProperties();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error al eliminar la propiedad");
    }
  };

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = properties.map((p) => p.location).filter(Boolean);
    return Array.from(new Set(locations)).sort();
  }, [properties]);

  // Filter properties based on all filter criteria
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search term (searches in code, location, and address)
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          property.code.toLowerCase().includes(search) ||
          property.location.toLowerCase().includes(search) ||
          property.street.toLowerCase().includes(search) ||
          (property.number && property.number.toLowerCase().includes(search));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filterLocation && property.location !== filterLocation) {
        return false;
      }

      // Availability filter
      if (filterAvailability !== "all") {
        const isAvailable = property.available.toLowerCase() === "yes";
        if (filterAvailability === "available" && !isAvailable) return false;
        if (filterAvailability === "not-available" && isAvailable) return false;
      }

      // Beds filter
      if (filterBeds !== "all") {
        const beds = String(property.beds);
        if (beds !== filterBeds) return false;
      }

      // Baths filter
      if (filterBaths !== "all") {
        const baths = String(property.baths);
        if (baths !== filterBaths) return false;
      }

      return true;
    });
  }, [properties, searchTerm, filterLocation, filterAvailability, filterBeds, filterBaths]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterLocation("");
    setFilterAvailability("all");
    setFilterBeds("all");
    setFilterBaths("all");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm ||
    filterLocation ||
    filterAvailability !== "all" ||
    filterBeds !== "all" ||
    filterBaths !== "all";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Cargando propiedades desde Google Sheets...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary playfair-display-sc">
              Properties
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {hasActiveFilters
                ? `Showing ${filteredProperties.length} of ${properties.length} properties`
                : `${properties.length} properties synced from Google Sheets`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors font-semibold shadow-sm disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
              <span className="sm:hidden">↻</span>
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by code, location, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Location
                  </label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-white"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Availability
                  </label>
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                  </select>
                </div>

                {/* Beds Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Bedrooms
                  </label>
                  <select
                    value={filterBeds}
                    onChange={(e) => setFilterBeds(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-white"
                  >
                    <option value="all">Any</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>

                {/* Baths Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Bathrooms
                  </label>
                  <select
                    value={filterBaths}
                    onChange={(e) => setFilterBaths(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-white"
                  >
                    <option value="all">Any</option>
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-border">
            <p className="text-muted-foreground mb-4 text-lg">
              No hay propiedades en el Google Sheet.
            </p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-border">
            <p className="text-muted-foreground mb-4 text-lg">
              No properties match your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Beds
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Baths
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProperties.map((property, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-primary">
                          {property.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                            property.available.toLowerCase() === "yes"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                              : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                          }`}
                        >
                          {property.available === "Yes" ? "✓ Available" : "✗ Not Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-base font-bold text-blue-600">
                          {property.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                          {property.beds}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-teal-100 text-teal-700 rounded-lg font-semibold text-sm">
                          {property.baths}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-xs truncate">
                          {property.street}
                          {property.number && ` ${property.number}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleView(property)}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 bg-blue-50 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md border border-blue-200"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2.5 text-amber-600 hover:bg-amber-100 bg-amber-50 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md border border-amber-200"
                            title="Edit property"
                          >
                            <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.code)}
                            className="p-2.5 text-red-600 hover:bg-red-100 bg-red-50 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md border border-red-200"
                            title="Delete property"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedProperty && (
          <>
            <ViewPropertyModal
              property={selectedProperty}
              isOpen={viewModalOpen}
              onClose={() => {
                setViewModalOpen(false);
                setSelectedProperty(null);
              }}
            />
            <EditPropertyModal
              property={selectedProperty}
              isOpen={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedProperty(null);
              }}
              onSave={handleSave}
            />
          </>
        )}

        {/* Add Property Modal */}
        <AddPropertyModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddProperty}
        />
      </div>
    </DashboardLayout>
  );
}
