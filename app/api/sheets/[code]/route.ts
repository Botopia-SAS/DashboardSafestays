import { NextRequest, NextResponse } from 'next/server';
import { getPropertyByCode, updateProperty, deleteProperty } from '@/lib/google/sheets';
import { SheetProperty } from '@/types/sheets';

// GET: Obtener una propiedad específica por código
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const property = await getPropertyByCode(code);

    if (property) {
      return NextResponse.json({ success: true, data: property });
    } else {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/sheets/[code]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch property';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una propiedad existente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body: SheetProperty = await request.json();

    const success = await updateProperty(code, body);

    if (success) {
      return NextResponse.json({ success: true, message: 'Property updated successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update property' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PUT /api/sheets/[code]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update property';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una propiedad
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const success = await deleteProperty(code);

    if (success) {
      return NextResponse.json({ success: true, message: 'Property deleted successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete property' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/sheets/[code]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete property';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
