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
      className={`relative overflow-hidden border-2 border-dashed transition-all duration-200 cursor-pointer
        ${isDragOver
          ? 'border-[#5B4FC4] bg-[#F0EDFA]'
          : error
            ? 'border-[#D84040]/50 bg-[#FDF0F0]'
            : 'border-[#E8E5DF] bg-white hover:border-[#9C9590] hover:bg-[#F5F3EF]/30'
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

      <div className="flex flex-col items-center justify-center p-8 sm:p-12 min-h-[200px]">
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
              <p className="text-[#6B6560] text-sm">
                Parsing your resume with AI...
              </p>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
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
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Upload className={`h-10 w-10 ${isDragOver ? 'text-[#5B4FC4]' : 'text-[#9C9590]'}`} />
              </motion.div>
              <div className="text-center">
                <p className="text-[#1A1A1A] text-sm font-medium">
                  Drag & drop your resume, or{' '}
                  <span className="text-[#5B4FC4] underline underline-offset-2">
                    click to browse
                  </span>
                </p>
                <p className="text-[#9C9590] text-xs mt-1">
                  PDF or DOCX · Max 5MB
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
