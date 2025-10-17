import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties, addProperty, searchProperties } from '@/lib/google/sheets';
import { SheetProperty } from '@/types/sheets';

// GET: Obtener todas las propiedades o buscar con filtros
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const available = searchParams.get('available');
    const beds = searchParams.get('beds');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Si hay filtros, usar searchProperties
    if (location || available || beds || minPrice || maxPrice) {
      const filters: Record<string, string | number> = {};
      if (location) filters.location = location;
      if (available) filters.available = available;
      if (beds) filters.beds = parseInt(beds);
      if (minPrice) filters.minPrice = parseFloat(minPrice);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

      const properties = await searchProperties(filters);
      return NextResponse.json({ success: true, data: properties });
    }

    // Si no hay filtros, obtener todas
    const properties = await getAllProperties();
    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    console.error('Error in GET /api/sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch properties';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Agregar una nueva propiedad
export async function POST(request: NextRequest) {
  try {
    const body: SheetProperty = await request.json();

    // Validar campos requeridos
    if (!body.code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    const success = await addProperty(body);

    if (success) {
      return NextResponse.json({ success: true, message: 'Property added successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to add property' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add property';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
