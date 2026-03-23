'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// How often to sample mouse position (ms)
const MOUSE_SAMPLE_INTERVAL = 300;
// Batch events every 5 seconds
const BATCH_FLUSH_INTERVAL = 5000;

interface TrackedPdfViewerProps {
  fileUrl: string;
  viewId: string | null;
}

interface HeatmapPoint {
  eventType: 'heatmap_click' | 'heatmap_scroll';
  x_pct: number;
  y_pct: number;
  page: number;
}

export function TrackedPdfViewer({ fileUrl, viewId }: TrackedPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(700);
  const containerRef = useRef<HTMLDivElement>(null);

  // Batch buffer for heatmap events
  const batchRef = useRef<HeatmapPoint[]>([]);
  const lastMouseSampleRef = useRef<number>(0);

  // Flush batch to API
  const flushBatch = useCallback(() => {
    const batch = batchRef.current.splice(0);
    if (!batch.length || !viewId) return;

    batch.forEach(point => {
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viewId,
          eventType: point.eventType,
          payload: { x_pct: point.x_pct, y_pct: point.y_pct, page: point.page }
        })
      }).catch(() => {});
    });
  }, [viewId]);

  // Periodic flush
  useEffect(() => {
    const interval = setInterval(flushBatch, BATCH_FLUSH_INTERVAL);
    return () => {
      clearInterval(interval);
      flushBatch(); // flush on unmount
    };
  }, [flushBatch]);

  // Responsive page width
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setPageWidth(Math.min(containerRef.current.clientWidth - 32, 800));
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Get coordinates relative to the container as percentages
  function getRelativeCoords(e: React.MouseEvent<HTMLDivElement>): { x_pct: number; y_pct: number } | null {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x_pct: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y_pct: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    };
  }

  // C3 — Click heatmap
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!viewId) return;
    const coords = getRelativeCoords(e);
    if (!coords) return;
    batchRef.current.push({ eventType: 'heatmap_click', ...coords, page: pageNumber });
    // Click events flush immediately (they're low frequency)
    flushBatch();
  }

  // C2 — Scroll/hover heatmap (throttled)
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!viewId) return;
    const now = Date.now();
    if (now - lastMouseSampleRef.current < MOUSE_SAMPLE_INTERVAL) return;
    lastMouseSampleRef.current = now;
    const coords = getRelativeCoords(e);
    if (!coords) return;
    batchRef.current.push({ eventType: 'heatmap_scroll', ...coords, page: pageNumber });
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full h-full overflow-auto bg-[#050505]">
      <div 
        className="relative my-4 flex flex-col leading-none" 
        style={{ width: pageWidth }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[800px] text-neutral-500">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[400px] text-red-400">
              Failed to load PDF.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={pageWidth}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Pagination Controls */}
      {numPages > 1 && (
        <div className="sticky bottom-4 flex items-center gap-3 bg-neutral-900/90 backdrop-blur border border-neutral-700 rounded-full px-4 py-2 shadow-xl mb-4">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-1 rounded-full hover:bg-neutral-800 disabled:opacity-30 transition-colors text-white"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-neutral-300 select-none tabular-nums">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="p-1 rounded-full hover:bg-neutral-800 disabled:opacity-30 transition-colors text-white"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
