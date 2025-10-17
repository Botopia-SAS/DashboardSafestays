// Estructura de las columnas del Google Sheet
export interface SheetProperty {
  // Columnas principales
  code: string;                    // CODE
  available: string;               // columna sin nombre (Yes/No)
  location: string;                // Location
  date: string;                    // Date
  month: string | number;          // Month
  price: string;                   // Price (formato: "€1,400")
  beds: string | number;           // Beds
  baths: string | number;          // Baths
  utilities: string;               // Utilities
  mts: string | number;            // mts (metros cuadrados)
  street: string;                  // Street
  number: string;                  // # (número de calle)
  agency: string;                  // Agency
  id: string;                      // ID (link de idealista)
  brochure: string;                // Brochure (link de safe-stays)
  video: string;                   // Video (link de Google Drive)
  whatsappMessage: string;         // Whatsapp Message

  // Columnas de agentes (para tracking)
  paulina?: string;                // Paulina
  alessandra?: string;             // Alessandra
  laura?: string;                  // Laura

  // Columnas de imágenes (Cloudinary)
  images?: string;                 // Array JSON de URLs de Cloudinary (columna principal)
  additionalImages?: string;       // Array JSON de URLs adicionales (columna extra)

  notes?: string;                  // Última columna con notas
}

// Para mapear row del sheet a este formato
export interface SheetRow {
  rowIndex: number;
  values: string[];
}

// Configuración del Sheet
export const SHEET_CONFIG = {
  SPREADSHEET_ID: '1Wt8qk1GXMnLy-B5eKjkC0rbVZubcyrcuqeCimcDByb8',
  SHEET_NAME: 'Hoja 1',
  RANGE: 'Hoja 1!A:X', // Desde columna A hasta X (incluye columnas de imágenes)
  HEADER_ROW: 1, // La fila 1 tiene los headers
};

// Índices de las columnas (0-based)
export const COLUMN_INDICES = {
  CODE: 0,
  AVAILABLE: 1,
  LOCATION: 2,
  DATE: 3,
  MONTH: 4,
  PRICE: 5,
  BEDS: 6,
  BATHS: 7,
  UTILITIES: 8,
  MTS: 9,
  STREET: 10,
  NUMBER: 11,
  AGENCY: 12,
  ID: 13,
  BROCHURE: 14,
  VIDEO: 15,
  WHATSAPP_MESSAGE: 16,
  PAULINA: 17,
  ALESSANDRA: 18,
  LAURA: 19,
  IMAGES: 20,              // Nueva columna para imágenes principales
  ADDITIONAL_IMAGES: 21,   // Nueva columna para imágenes adicionales
  NOTES: 22,               // Movida a columna 22
};

// Helper para convertir precio de formato europeo a número
export function parsePriceFromSheet(priceStr: string): number {
  if (!priceStr) return 0;
  // Remueve €, espacios, y convierte coma a punto
  return parseFloat(priceStr.replace(/[€\s,]/g, '').replace(',', '.')) || 0;
}

// Helper para convertir número a formato de precio europeo
export function formatPriceForSheet(price: number): string {
  return `€${price.toLocaleString('es-ES')}`;
}

// Helper para convertir row array a SheetProperty
export function rowToSheetProperty(row: string[], rowIndex: number): SheetProperty {
  return {
    code: row[COLUMN_INDICES.CODE] || '',
    available: row[COLUMN_INDICES.AVAILABLE] || '',
    location: row[COLUMN_INDICES.LOCATION] || '',
    date: row[COLUMN_INDICES.DATE] || '',
    month: row[COLUMN_INDICES.MONTH] || '',
    price: row[COLUMN_INDICES.PRICE] || '',
    beds: row[COLUMN_INDICES.BEDS] || '',
    baths: row[COLUMN_INDICES.BATHS] || '',
    utilities: row[COLUMN_INDICES.UTILITIES] || '',
    mts: row[COLUMN_INDICES.MTS] || '',
    street: row[COLUMN_INDICES.STREET] || '',
    number: row[COLUMN_INDICES.NUMBER] || '',
    agency: row[COLUMN_INDICES.AGENCY] || '',
    id: row[COLUMN_INDICES.ID] || '',
    brochure: row[COLUMN_INDICES.BROCHURE] || '',
    video: row[COLUMN_INDICES.VIDEO] || '',
    whatsappMessage: row[COLUMN_INDICES.WHATSAPP_MESSAGE] || '',
    paulina: row[COLUMN_INDICES.PAULINA] || '',
    alessandra: row[COLUMN_INDICES.ALESSANDRA] || '',
    laura: row[COLUMN_INDICES.LAURA] || '',
    images: row[COLUMN_INDICES.IMAGES] || '',
    additionalImages: row[COLUMN_INDICES.ADDITIONAL_IMAGES] || '',
    notes: row[COLUMN_INDICES.NOTES] || '',
  };
}

// Helper para convertir SheetProperty a row array
export function sheetPropertyToRow(property: SheetProperty): string[] {
  const row = new Array(23).fill(''); // Aumentado a 23 para incluir nuevas columnas

  row[COLUMN_INDICES.CODE] = property.code;
  row[COLUMN_INDICES.AVAILABLE] = property.available;
  row[COLUMN_INDICES.LOCATION] = property.location;
  row[COLUMN_INDICES.DATE] = property.date;
  row[COLUMN_INDICES.MONTH] = String(property.month);
  row[COLUMN_INDICES.PRICE] = property.price;
  row[COLUMN_INDICES.BEDS] = String(property.beds);
  row[COLUMN_INDICES.BATHS] = String(property.baths);
  row[COLUMN_INDICES.UTILITIES] = property.utilities;
  row[COLUMN_INDICES.MTS] = String(property.mts);
  row[COLUMN_INDICES.STREET] = property.street;
  row[COLUMN_INDICES.NUMBER] = property.number;
  row[COLUMN_INDICES.AGENCY] = property.agency;
  row[COLUMN_INDICES.ID] = property.id;
  row[COLUMN_INDICES.BROCHURE] = property.brochure;
  row[COLUMN_INDICES.VIDEO] = property.video;
  row[COLUMN_INDICES.WHATSAPP_MESSAGE] = property.whatsappMessage;
  row[COLUMN_INDICES.PAULINA] = property.paulina || '';
  row[COLUMN_INDICES.ALESSANDRA] = property.alessandra || '';
  row[COLUMN_INDICES.LAURA] = property.laura || '';
  row[COLUMN_INDICES.IMAGES] = property.images || '';
  row[COLUMN_INDICES.ADDITIONAL_IMAGES] = property.additionalImages || '';
  row[COLUMN_INDICES.NOTES] = property.notes || '';

  return row;
}

// Helper para parsear array de imágenes desde string JSON
export function parseImagesFromString(imagesStr: string): string[] {
  if (!imagesStr) return [];
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper para convertir array de imágenes a string JSON
export function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}
