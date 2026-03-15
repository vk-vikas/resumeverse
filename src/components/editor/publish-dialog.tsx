'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Copy, Check, ExternalLink, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
}

export function PublishDialog({ open, onOpenChange, slug }: PublishDialogProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const shareUrl = `${baseUrl}/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    const text = `Check out my interactive resume built with ResumeVerse! 🚀`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <DialogTitle className="text-lg text-white">Your resume is live!</DialogTitle>
          </div>
          <DialogDescription className="text-neutral-400">
            Share your interactive resume with anyone using the link below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Shareable URL */}
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-neutral-800/50 border-neutral-700 text-white text-sm flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-neutral-700 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-neutral-400" />
              )}
            </Button>
          </div>

          {/* QR Code */}
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={shareUrl}
              size={160}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(shareUrl, '_blank')}
              className="border-neutral-700 text-neutral-300 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-neutral-700 text-neutral-300 hover:text-white"
            >
              <Copy className="h-4 w-4 mr-1.5" />
              Copy Link
            </Button>
          </div>

          {/* Social sharing */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnLinkedIn}
              className="flex-1 border-neutral-700 text-neutral-400 hover:text-[#0077b5] hover:border-[#0077b5]/50"
            >
              <Linkedin className="h-4 w-4 mr-1.5" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="flex-1 border-neutral-700 text-neutral-400 hover:text-[#1da1f2] hover:border-[#1da1f2]/50"
            >
              <Twitter className="h-4 w-4 mr-1.5" />
              Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
