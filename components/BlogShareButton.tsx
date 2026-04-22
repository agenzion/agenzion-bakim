'use client';

import { Share2 } from 'lucide-react';

interface BlogShareButtonProps {
  label: string;
  title: string;
  text?: string;
}

export default function BlogShareButton({ label, title, text }: BlogShareButtonProps) {
  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await navigator.clipboard?.writeText(url);
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleShare}
      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white hover:text-[#020205] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070711]"
    >
      <Share2 size={18} />
    </button>
  );
}
