import { google } from 'googleapis';
import { SheetProperty, SHEET_CONFIG, rowToSheetProperty, sheetPropertyToRow } from '@/types/sheets';

// Obtener credenciales desde variables de entorno
function getCredentials() {
  const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  
  if (credentialsBase64) {
    // Decodificar de Base64
    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    return JSON.parse(credentialsJson);
  }
  
  // Fallback para desarrollo local
  if (process.env.NODE_ENV === 'development') {
    try {
      return require('./credentials.json');
    } catch (error) {
      throw new Error('No credentials found. Set GOOGLE_CREDENTIALS_BASE64 environment variable.');
    }
  }
  
  throw new Error('GOOGLE_CREDENTIALS_BASE64 environment variable is required in production.');
}

// Inicializar cliente de Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: getCredentials(),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Lee todas las propiedades del Google Sheet
 */
export async function getAllProperties(): Promise<SheetProperty[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      range: SHEET_CONFIG.RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Saltar la fila de headers (índice 0)
    const dataRows = rows.slice(1);

    // Convertir cada row a SheetProperty
    return dataRows.map((row, index) => rowToSheetProperty(row, index + 2)); // +2 porque empezamos en row 2
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    throw new Error('Failed to fetch properties from Google Sheets');
  }
}

/**
 * Obtiene una propiedad por su código
 */
export async function getPropertyByCode(code: string): Promise<SheetProperty | null> {
  try {
    const properties = await getAllProperties();
    return properties.find((p) => p.code === code) || null;
  } catch (error) {
    console.error('Error getting property by code:', error);
    return null;
  }
}

/**
 * Agrega una nueva propiedad al Sheet
 */
export async function addProperty(property: SheetProperty): Promise<boolean> {
  try {
    const row = sheetPropertyToRow(property);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      range: SHEET_CONFIG.RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return true;
  } catch (error) {
    console.error('Error adding property to Google Sheets:', error);
    return false;
  }
}

/**
 * Actualiza una propiedad existente en el Sheet
 */
export async function updateProperty(code: string, updatedProperty: SheetProperty): Promise<boolean> {
  try {
    // Primero obtener todas las propiedades para encontrar el índice
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      range: SHEET_CONFIG.RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return false;
    }

    // Encontrar el índice de la row (empezando desde 0, pero row 1 es header)
    const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === code);

    if (rowIndex === -1) {
      return false;
    }

    const actualRowNumber = rowIndex + 1; // +1 para convertir a número de fila de Sheets
    const row = sheetPropertyToRow(updatedProperty);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      range: `${SHEET_CONFIG.SHEET_NAME}!A${actualRowNumber}:X${actualRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating property in Google Sheets:', error);
    return false;
  }
}

/**
 * Elimina una propiedad del Sheet
 */
export async function deleteProperty(code: string): Promise<boolean> {
  try {
    // Primero obtener todas las propiedades para encontrar el índice
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      range: SHEET_CONFIG.RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return false;
    }

    // Encontrar el índice de la row
    const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === code);

    if (rowIndex === -1) {
      return false;
    }

    // Eliminar la fila usando batchUpdate
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_CONFIG.SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // ID de la primera hoja
                dimension: 'ROWS',
                startIndex: rowIndex, // índice base 0
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting property from Google Sheets:', error);
    return false;
  }
}

/**
 * Busca propiedades por filtros
 */
export async function searchProperties(filters: {
  location?: string;
  available?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
}): Promise<SheetProperty[]> {
  try {
    const properties = await getAllProperties();

    return properties.filter((property) => {
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.available && property.available !== filters.available) {
        return false;
      }

      if (filters.beds && Number(property.beds) !== filters.beds) {
        return false;
      }

      // Filtros de precio
      if (filters.minPrice || filters.maxPrice) {
        const priceStr = property.price.replace(/[€\s,]/g, '');
        const price = parseFloat(priceStr) || 0;

        if (filters.minPrice && price < filters.minPrice) {
          return false;
        }

        if (filters.maxPrice && price > filters.maxPrice) {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}
