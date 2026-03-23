import pdf from 'pdf-parse';

/**
 * Extract all text content and embedded hyperlinks from a PDF file buffer.
 * Uses a custom pdf-parse render engine to read the PDF Annotations dictionary.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const options = {
    pagerender: async function(pageData: any) {
      // 1. Extract standard text layer
      const textContent = await pageData.getTextContent();
      let text = '';
      for (const item of textContent.items) {
        text += item.str + ' ';
      }

      // 2. Extract embedded Annotations (hyperlinks) layer
      let annotationsText = '';
      try {
        const annotations = await pageData.getAnnotations();
        const urls = annotations
          .filter((a: any) => a.subtype === 'Link' && a.url)
          .map((a: any) => a.url);

        if (urls.length > 0) {
          annotationsText = '\n\n[EMBEDDED HYPERLINKS ON THIS PAGE]:\n' + urls.join('\n');
        }
      } catch (err) {
        console.warn('Failed to parse PDF annotations for links:', err);
      }

      // Append the collected URLs to the string output of this page
      return text + annotationsText;
    }
  };

  const data = await pdf(buffer, options);
  return data.text.trim();
}
