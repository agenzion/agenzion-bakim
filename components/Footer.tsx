import React from 'react';
import { Building2, ExternalLink, Instagram, Linkedin, type LucideIcon } from 'lucide-react';
import type { FooterSocialLink } from '@/lib/site';

const defaultSocialLinks: FooterSocialLink[] = [
  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/company/agenzion',
    gradientFrom: '#5cb8ff',
    gradientTo: '#0a66c2',
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/agenzion',
    gradientFrom: '#f9ce34',
    gradientTo: '#c13584',
  },
  {
    title: 'Napolion',
    href: 'https://napolion.com.tr',
    gradientFrom: '#7cf7c3',
    gradientTo: '#0f9d8a',
  },
];

const iconByTitle: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  napolion: Building2,
};

function getSocialIcon(title: string) {
  return iconByTitle[title.toLowerCase()] || ExternalLink;
}

const Footer: React.FC<{
  copy: {
    copyrightName: string;
  };
  socialLinks?: FooterSocialLink[];
}> = ({ copy, socialLinks = defaultSocialLinks }) => {
  const links = socialLinks.length ? socialLinks : defaultSocialLinks;

  return (
    <footer className="border-t border-white/5 bg-transparent px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <p className="text-center text-xs tracking-[0.18em] text-white/38 md:text-left">
          © {new Date().getFullYear()} {copy.copyrightName}.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {links.map(({ title, href, gradientFrom = '#7cf7c3', gradientTo = '#0f9d8a' }) => {
            const isExternal = href.startsWith('http');
            const Icon = getSocialIcon(title);

            return (
              <li key={title}>
                <a
                  href={href}
                  aria-label={title}
                  title={title}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  style={
                    {
                      '--gradient-from': gradientFrom,
                      '--gradient-to': gradientTo,
                    } as React.CSSProperties
                  }
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/62 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-white focus-visible:-translate-y-0.5 focus-visible:border-white/20 focus-visible:text-white focus-visible:outline-none"
                >
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-opacity duration-200 group-hover:opacity-20 group-focus-visible:opacity-20" />
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-md border border-white/10 bg-black/85 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg shadow-black/30 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {title}
                  </span>
                  <Icon className="relative z-10 h-4 w-4" strokeWidth={2} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
