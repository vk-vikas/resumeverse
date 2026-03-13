import mammoth from 'mammoth';

/**
 * Extract all text content from a DOCX file buffer.
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}
