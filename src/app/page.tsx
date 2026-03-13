import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl space-y-6">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="mr-1 h-3 w-3" />
          AI-Powered
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Resume<span className="text-blue-500">Verse</span>
        </h1>
        <p className="text-lg text-neutral-400 leading-relaxed">
          Transform your PDF/DOCX resume into a beautiful, interactive,
          shareable website — powered by AI.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
              <Upload className="h-4 w-4 text-blue-400" />
              Upload Resume
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
              <Sparkles className="h-4 w-4 text-purple-400" />
              AI Transforms
            </CardContent>
          </Card>
          <Card className="bg-neutral-900/50 border-neutral-800">
            <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
              <Share2 className="h-4 w-4 text-green-400" />
              Share Everywhere
            </CardContent>
          </Card>
        </div>

        <div className="pt-6">
          <Button size="lg" className="text-base px-8">
            Get Started — It&apos;s Free
          </Button>
        </div>

        <p className="text-sm text-neutral-600 pt-2">
          3 stunning themes · Shareable links · View analytics · $0 cost
        </p>
      </div>

      {/* Tailwind test div (can remove later) */}
      <div className="mt-12 h-2 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </div>
  );
}
