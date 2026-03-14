import pdf from 'pdf-parse';

/**
 * Extract all text content from a PDF file buffer.
 * Uses pdf-parse v1 which works without workers in Node.js.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text.trim();
}
