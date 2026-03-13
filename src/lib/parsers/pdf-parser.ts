import { PDFParse } from 'pdf-parse';

/**
 * Extract all text content from a PDF file buffer.
 * Uses pdf-parse v2 API with PDFParse class.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}
