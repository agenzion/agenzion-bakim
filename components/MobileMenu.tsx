'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionValue, Variants } from 'motion/react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { type Locale, getLocalizedPath } from '@/lib/i18n';

interface MobileMenuProps {
  color?: string | MotionValue<string>;
  locale: Locale;
  copy: {
    about: string;
    blog: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
    socialLabel: string;
    socialLinks: readonly string[];
    mobileCopyright: string;
  };
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  color = 'white',
  locale,
  copy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const canUseDOM = typeof document !== 'undefined';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const menuItems = [
    { name: copy.about, href: getLocalizedPath(locale, 'about') },
    { name: copy.blog, href: getLocalizedPath(locale, 'blog') },
    { name: copy.contact, href: getLocalizedPath(locale, 'contact') },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const menuOverlay = canUseDOM
    ? createPortal(
        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.button
                key="mobile-menu-backdrop"
                type="button"
                aria-label={copy.closeMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[119] bg-black/60 backdrop-blur-sm md:hidden"
              />

              <motion.aside
                key="mobile-menu-panel"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-y-0 right-0 z-[120] flex w-full max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-neutral-950 px-6 py-6 text-white shadow-2xl md:hidden"
              >
                <div className="mb-12 flex items-center justify-between gap-4">
                  <Link
                    href={getLocalizedPath(locale, 'home')}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <BrandLogo darkOpacity={0} lightOpacity={1} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label={copy.closeMenu}
                    className="rounded-full border border-white/10 p-2 text-white transition-transform active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col gap-6">
                  {menuItems.map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between border-b border-white/8 pb-4 text-3xl font-bold tracking-tight text-white"
                      >
                        <span>{item.name}</span>
                        <ArrowRight className="text-[#4592AF] transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto pt-12">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                      {copy.socialLabel}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-neutral-300">
                      {copy.socialLinks.map((label) => (
                        <a
                          key={label}
                          href="#"
                          className="transition-colors hover:text-white"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-[10px] font-mono text-neutral-600">
                    © {new Date().getFullYear()} {copy.mobileCopyright}
                  </p>
                </div>

                <div className="pointer-events-none absolute top-16 right-[-4rem] h-48 w-48 rounded-full bg-[#4592AF]/15 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-12 left-[-5rem] h-56 w-56 rounded-full bg-blue-700/10 blur-[110px]" />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label={copy.openMenu}
        className="relative z-[121] p-2 transition-transform active:scale-90 md:hidden"
        style={{ color }}
      >
        <Menu size={28} />
      </motion.button>

      {menuOverlay}
    </>
  );
};

export default MobileMenu;
