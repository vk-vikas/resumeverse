declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  interface PDFOptions {
    pagerender?: (pageData: any) => Promise<string> | string;
    max?: number;
    version?: string;
  }

  function pdf(buffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export default pdf;
}
