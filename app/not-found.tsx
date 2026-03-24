import Link from 'next/link';

import { getLocaleContent } from '@/lib/site-content';

const content = getLocaleContent('tr');

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
      <h2 className="text-6xl font-black brand-font mb-4">{content.notFound.code}</h2>
      <p className="text-neutral-400 mb-8">{content.notFound.description}</p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
      >
        {content.notFound.cta}
      </Link>
    </div>
  );
}
