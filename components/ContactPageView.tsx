'use client';

import React from 'react';
import { motion } from 'motion/react';

import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { NavigationCopy } from '@/components/navigation';
import type { Locale } from '@/lib/i18n';

export default function ContactPageView({
  locale,
  alternatePath,
  navigation,
  contact,
  footer,
}: {
  locale: Locale;
  alternatePath: string;
  navigation: NavigationCopy;
  contact: {
    pageTitle: string;
    homeHeadingLine1: string;
    homeHeadingLine2: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    pageIntro: string;
    formHelper: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submittingLabel: string;
    submitLabel: string;
    addressLine1: string;
    addressLine2: string;
    emailValue: string;
    emailHint: string;
    phoneValue: string;
    phoneHint: string;
  };
  footer: {
    copyrightName: string;
  };
}) {
  return (
    <main
      lang={locale}
      className="relative min-h-screen overflow-hidden bg-transparent text-white"
    >
      <Navbar dark locale={locale} alternatePath={alternatePath} copy={navigation} />
      <div className="relative z-10 pt-40 pb-10 px-6 md:px-8 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 brand-font"
        >
          {contact.pageTitle}
        </motion.h1>
      </div>
      <div className="relative z-10">
        <Contact
          copy={contact}
          showForm={true}
          showMap={true}
          hideHeader={true}
          layout="page"
        />
      </div>
      <Footer copy={footer} />
    </main>
  );
}
