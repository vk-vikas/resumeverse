'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <FileQuestion className="h-10 w-10 text-neutral-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-neutral-300">Page not found</h2>
          <p className="text-neutral-500">
            The resume or page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
