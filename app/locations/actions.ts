"use server";

import { createClient } from "@/lib/supabase/server";
import { Property, PropertyFormData } from "@/types/property";
import { revalidatePath } from "next/cache";

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

export async function createProperty(formData: PropertyFormData): Promise<{
  success: boolean;
  error?: string;
  property?: Property;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .insert([formData])
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/locations");
  return { success: true, property: data };
}

export async function deleteProperty(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/locations");
  return { success: true };
}
