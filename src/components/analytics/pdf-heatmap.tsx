'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, MousePointer2, Layers } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface HeatPoint {
  x_pct: number;
  y_pct: number;
  page?: number;
}

interface PdfHeatmapProps {
  fileUrl: string;
  clicks: HeatPoint[];
  scrolls: HeatPoint[];
}

const COLORS_CLICK = 'rgba(239, 68, 68,'; // red for clicks
const COLORS_SCROLL = 'rgba(59, 130, 246,'; // blue for scroll dwell

function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatPoint[],
  color: string,
  radius: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !points.length) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // Draw Gaussian blobs for each point
  points.forEach(p => {
    const x = (p.x_pct / 100) * width;
    const y = (p.y_pct / 100) * height;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `${color} 0.4)`);
    grad.addColorStop(0.5, `${color} 0.15)`);
    grad.addColorStop(1, `${color} 0)`);
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function PdfHeatmap({ fileUrl, clicks, scrolls }: PdfHeatmapProps) {
  const [activeLayer, setActiveLayer] = useState<'clicks' | 'scrolls'>('clicks');
  const [containerWidth, setContainerWidth] = useState(600);
  const [numPages, setNumPages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(1.414); // Fallback to A4 initially
  const containerRef = useRef<HTMLDivElement>(null);
  const clickCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollCanvasRef = useRef<HTMLCanvasElement>(null);

  function onPageLoadSuccess(page: any) {
    if (page.originalWidth && page.originalHeight) {
      setAspectRatio(page.originalHeight / page.originalWidth);
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Debounce slightly or just set directly since react batches
        setContainerWidth(entry.contentRect.width - 2);
      }
    });
    
    observer.observe(containerRef.current);
    
    // Initial set just in case observer misses the very first paint
    setContainerWidth(containerRef.current.clientWidth - 2);
    
    return () => observer.disconnect();
  }, []);

  // Redraw heatmap when layer or data changes
  useEffect(() => {
    const page = 1; // Show heatmap for page 1 for now
    const clickPoints = clicks.filter(p => !p.page || p.page === page);
    const scrollPoints = scrolls.filter(p => !p.page || p.page === page);

    // We draw on a slight delay so the PDF page canvas has rendered
    const t = setTimeout(() => {
      if (clickCanvasRef.current) {
        drawHeatmap(clickCanvasRef.current, clickPoints, COLORS_CLICK, 28);
      }
      if (scrollCanvasRef.current) {
        drawHeatmap(scrollCanvasRef.current, scrollPoints, COLORS_SCROLL, 40);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [clicks, scrolls, containerWidth]);

  const hasData = clicks.length > 0 || scrolls.length > 0;

  return (
    <div className="space-y-4">
      {/* Layer toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveLayer('clicks')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeLayer === 'clicks'
              ? 'bg-red-500/10 text-[#D84040] border border-red-500/20'
              : 'bg-white text-[#6B6560] border border-[#E8E5DF] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]'
          }`}
        >
          <MousePointer2 className="h-3.5 w-3.5" />
          Clicks ({clicks.length})
        </button>
        <button
          onClick={() => setActiveLayer('scrolls')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeLayer === 'scrolls'
              ? 'bg-blue-500/10 text-[#5B4FC4] border border-blue-500/20'
              : 'bg-white text-[#6B6560] border border-[#E8E5DF] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Attention Map ({scrolls.length})
        </button>
      </div>

      {/* Heatmap viewer */}
      <div
        ref={containerRef}
        className="relative border border-[#E8E5DF] rounded-xl overflow-hidden bg-[#FAFAF8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        {!hasData ? (
          <div className="h-[500px] flex flex-col items-center justify-center text-[#9C9590] gap-3">
            <Layers className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium text-[#6B6560]">No interaction data yet.</p>
            <p className="text-xs">Heatmap will appear after visitors interact with the resume.</p>
          </div>
        ) : (
          <div className="relative" style={{ width: containerWidth }}>
            {/* PDF rendered as the base layer */}
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="h-[600px] flex items-center justify-center text-[#9C9590]">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              }
            >
              <Page 
                pageNumber={1} 
                width={containerWidth} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                onLoadSuccess={onPageLoadSuccess}
              />
            </Document>

            {/* Click heatmap canvas overlay */}
            <canvas
              ref={clickCanvasRef}
              width={containerWidth}
              height={containerWidth * aspectRatio}
              className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
                activeLayer === 'clicks' ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Scroll/attention heatmap canvas overlay */}
            <canvas
              ref={scrollCanvasRef}
              width={containerWidth}
              height={containerWidth * aspectRatio}
              className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
                activeLayer === 'scrolls' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-[#9C9590] text-center">
        🔴 Red = click locations &nbsp;|&nbsp; 🔵 Blue = attention dwell positions &nbsp;|&nbsp; Showing page 1
      </p>
    </div>
  );
}
