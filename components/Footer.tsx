import React from 'react';
import { Building2, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    title: 'LINKEDIN',
    href: '#',
    icon: Linkedin,
    gradientFrom: '#5cb8ff',
    gradientTo: '#0a66c2',
  },
  {
    title: 'INSTAGRAM',
    href: '#',
    icon: Instagram,
    gradientFrom: '#f9ce34',
    gradientTo: '#c13584',
  },
  {
    title: 'NAPOLION',
    href: '#',
    icon: Building2,
    gradientFrom: '#7cf7c3',
    gradientTo: '#0f9d8a',
  },
] as const;

const Footer: React.FC<{
  copy: {
    copyrightName: string;
  };
}> = ({ copy }) => {
  return (
    <footer className="border-t border-white/5 bg-transparent px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <p className="text-center text-xs tracking-[0.18em] text-white/38 md:text-left">
          © {new Date().getFullYear()} {copy.copyrightName}.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {socialLinks.map(({ title, href, icon: Icon, gradientFrom, gradientTo }) => {
            const isExternal = href.startsWith('http');

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
