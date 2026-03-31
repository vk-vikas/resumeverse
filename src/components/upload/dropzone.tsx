'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FilePreview } from './file-preview';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function Dropzone({ onFileSelect, isLoading = false }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      return 'Only PDF and DOCX files are accepted';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be under 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  }, [isLoading]);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <Card
      className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer rounded-2xl
        ${isDragOver
          ? 'border-[#5B4FC4] bg-[#F0EDFA] shadow-md scale-[1.01]'
          : error
            ? 'border-[#D84040]/50 bg-[#FDF0F0]'
            : 'border-[#E8E5DF] bg-white hover:border-[#5B4FC4]/40 hover:bg-[#FAFAF8] shadow-sm hover:shadow-md'
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload your resume file"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload your resume"
      />

      <div className="flex flex-col items-center justify-center p-8 sm:p-12 min-h-[220px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-10 w-10 text-[#5B4FC4] animate-spin" />
              <p className="text-[#6B6560] font-medium text-sm animate-pulse">
                Parsing document structure using AI...
              </p>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <FilePreview file={selectedFile} onRemove={handleRemove} />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={isDragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragOver ? 'bg-[#5B4FC4] text-white shadow-md' : 'bg-[#FAFAF8] text-[#5B4FC4] shadow-sm border border-[#E8E5DF]'}`}
              >
                <Upload className="h-8 w-8" />
              </motion.div>
              <div className="text-center space-y-1">
                <p className="text-[#1A1A1A] text-lg font-bold">
                  Drag & drop your resume, or{' '}
                  <span className="text-[#5B4FC4] hover:text-[#3A2A9A] underline underline-offset-4 decoration-2 transition-colors">
                    click to browse
                  </span>
                </p>
                <p className="text-[#6B6560] text-sm font-medium">
                  Supports PDF or DOCX format (Max 5MB)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 mt-4 text-[#D84040] text-sm"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
