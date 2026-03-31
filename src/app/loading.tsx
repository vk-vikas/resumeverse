import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#FAFAF8] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-[#5B4FC4] animate-spin" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#5B4FC4] to-[#8B5CF6] bg-clip-text text-transparent animate-pulse">
          Loading ResumeVerse...
        </h2>
      </div>
    </div>
  );
}
