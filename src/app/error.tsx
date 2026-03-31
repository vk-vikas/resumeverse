'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-[#FDF0F0] border border-[#D84040]/20 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-[#D84040]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Something went wrong</h1>
          <p className="text-[#6B6560]">
            An unexpected error occurred. Don&apos;t worry — your data is safe.
          </p>
          {error.digest && (
            <p className="text-xs text-[#9C9590] font-mono mt-2">Error ID: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={reset}
            size="lg"
            className="bg-[#5B4FC4] text-white hover:bg-[#4A3FB0]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-[#E8E5DF] text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F3EF] w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
