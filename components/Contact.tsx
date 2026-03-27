'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowRight, Check, Loader2, Mail, MapPin, Navigation, Phone, X } from 'lucide-react';
import ShinyButton from './ShinyButton';
import useIsMobile from '@/lib/useIsMobile';

interface ContactProps {
  showForm?: boolean;
  showMap?: boolean;
  hideHeader?: boolean;
  layout?: 'default' | 'page';
  copy: {
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
}

const EARTH_IMAGE_SRC = '/images/space/earth.jpg';

const EarthOrb = ({
  className = 'w-[220px] sm:w-[260px] lg:w-[320px]',
}: {
  className?: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`relative mx-auto aspect-square pointer-events-none select-none ${className}`}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="absolute inset-[-18%] rounded-full bg-[#4592AF]/18 blur-[70px]" />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-[-5%]"
          initial={{ x: '-2%', scale: 1.16 }}
          animate={
            isMobile
              ? undefined
              : {
                  x: ['-2%', '3%', '-2%'],
                  scale: [1.16, 1.175, 1.16],
                }
          }
          transition={
            isMobile
              ? undefined
              : {
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          <Image
            src={EARTH_IMAGE_SRC}
            alt="Earth"
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 220px"
            className="object-cover"
            draggable={false}
            style={{
              filter: 'brightness(0.88) saturate(1.05) contrast(1.08)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

const RevealLine = ({
  delay = 0,
  className = '',
}: {
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    className={`absolute bottom-0 left-0 h-px origin-left bg-white/14 ${className}`}
  />
);

const Contact: React.FC<ContactProps> = ({
  showForm = true,
  showMap = true,
  hideHeader = false,
  layout = 'default',
  copy,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMapActive, setIsMapActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    }, 2000);
  };

  const renderFormContent = (variant: 'default' | 'page') => (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`flex flex-col p-12 ${
            variant === 'page'
              ? 'items-start px-0 py-6 text-left'
              : 'items-center rounded-[2rem] border border-white/10 bg-[#111] text-center'
          }`}
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-black">
            <Check size={40} strokeWidth={3} />
          </div>
          <h3 className="brand-font mb-4 text-3xl font-bold text-white">{copy.successTitle}</h3>
          <p className="mb-8 max-w-md text-neutral-400">
            {copy.successBody}
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-sm text-neutral-500 underline underline-offset-4 transition-colors hover:text-white"
          >
            {copy.sendAnother}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className={`${
            variant === 'page'
              ? 'flex h-full flex-col px-0 py-2'
              : 'rounded-[2rem] border border-white/5 bg-neutral-900/50 p-8 backdrop-blur-sm md:p-10'
          }`}
        >
          <div className="mb-8 flex flex-col gap-0">
            {variant === 'page' ? (
              <>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
                  {copy.formHelper}
                </p>
              </>
            ) : null}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative pb-4">
              <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]">
                {copy.nameLabel}
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder={copy.namePlaceholder}
                className={`brand-font w-full bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl ${
                  variant === 'page' ? '' : 'border-b border-white/20'
                }`}
              />
              {variant === 'page' ? <RevealLine delay={0.9} className="w-full" /> : null}
            </div>
            <div className="group relative pb-4">
              <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]">
                {copy.emailLabel}
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder={copy.emailPlaceholder}
                className={`brand-font w-full bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl ${
                  variant === 'page' ? '' : 'border-b border-white/20'
                }`}
              />
              {variant === 'page' ? <RevealLine delay={1} className="w-full" /> : null}
            </div>
          </div>
          <div className="group relative mb-8 flex-1 pb-4">
            <label className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]">
              {copy.messageLabel}
            </label>
            <textarea
              rows={variant === 'page' ? 3 : 3}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              placeholder={copy.messagePlaceholder}
              className={`brand-font w-full resize-none bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl ${
                variant === 'page' ? '' : 'border-b border-white/20'
              }`}
            />
            {variant === 'page' ? <RevealLine delay={1.1} className="w-full" /> : null}
          </div>
          <div className="flex justify-end">
            <ShinyButton
              type="submit"
              disabled={isSubmitting}
              className="min-w-[216px] px-8 py-4 text-sm font-bold tracking-[0.24em] md:px-10 md:py-5 md:text-base"
            >
              {isSubmitting ? (
                <>
                  <span>{copy.submittingLabel}</span>
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                <>
                  <span>{copy.submitLabel}</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </ShinyButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );

  if (layout === 'page') {
    return (
      <section className="relative overflow-hidden pb-24">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="flex h-full flex-col py-2 pr-0 md:pr-10 lg:pr-14"
            >
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
                {copy.pageIntro}
              </p>

              <div className="mt-10 space-y-6">
                <div className="relative flex gap-4 pb-6">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <MapPin className="text-white/70" />
                  </div>
                  <div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Atak%C3%B6y%207-8-9-10.%20K%C4%B1s%C4%B1m%20Mah.%20%C3%87oban%C3%A7e%C5%9Fme%20E-5%2C%20Yan%20Yol%20No%3A%2014%2FA%2C%2034158%20Bak%C4%B1rk%C3%B6y%2F%C4%B0stanbul%20%2F%20%C4%B0K%C3%9C%20TEKMER"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block transition-colors hover:text-[#4592AF]"
                    >
                      <p className="brand-font text-lg font-bold text-white">
                        {copy.addressLine1}
                      </p>
                    </a>
                    <p className="text-sm font-mono text-white/48">{copy.addressLine2}</p>
                  </div>
                  <RevealLine delay={0.9} className="w-full" />
                </div>
                <div className="relative flex gap-4 pb-6">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <Mail className="text-white/70" />
                  </div>
                  <div>
                    <a
                      href="mailto:info@agenzion.com"
                      className="inline-block transition-colors hover:text-[#4592AF]"
                    >
                      <p className="brand-font text-lg font-bold text-white">{copy.emailValue}</p>
                    </a>
                    <p className="text-sm font-mono text-white/48">{copy.emailHint}</p>
                  </div>
                  <RevealLine delay={1} className="w-full" />
                </div>
                <div className="flex gap-4 pb-2">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <Phone className="text-white/70" />
                  </div>
                  <div>
                    <a
                      href="tel:+905404553444"
                      className="inline-block transition-colors hover:text-[#4592AF]"
                    >
                      <p className="brand-font text-lg font-bold text-white">{copy.phoneValue}</p>
                    </a>
                    <p className="text-sm font-mono text-white/48">{copy.phoneHint}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {showForm ? (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: 'easeOut', delay: 0.08 }}
                className="h-full"
              >
                {renderFormContent('page')}
              </motion.div>
            ) : null}
          </div>

          {showMap ? (
            <>
              <div className="relative mt-16 hidden h-[470px] lg:block">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="absolute left-0 top-[16%] z-20 w-[26.7%] max-w-[320px]"
                >
                  <EarthOrb className="w-full max-w-none" />
                </motion.div>

                <svg
                  className="pointer-events-none absolute inset-0 z-30 h-full w-full"
                  viewBox="0 0 1200 470"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="contact-map-trace" x1="62" y1="163" x2="1185" y2="400" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="white" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.14" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d="M 62 163 L 500 163 L 500 70 L 1185 70 L 1185 400 L 500 400 L 500 163"
                    stroke="url(#contact-map-trace)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, pathLength: 0, pathOffset: 0 }}
                    whileInView={{
                      opacity: [0, 1, 1, 0],
                      pathLength: [0, 0.235, 0.235, 0],
                      pathOffset: [0, 0, 0.765, 1],
                    }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{
                      duration: 2,
                      delay: 1.25,
                      ease: 'linear',
                      times: [0, 0.24, 0.88, 1],
                    }}
                  />
                </svg>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 1.5, delay: 3, ease: 'easeOut' }}
                  className="absolute z-10 overflow-hidden bg-[#05070d]"
                  style={{
                    left: '41.67%',
                    top: '14.9%',
                    width: '57.08%',
                    height: '70.21%',
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps?q=Agenzion%20Web%20Studio%2C%20Atak%C3%B6y%207-8-9-10.%20K%C4%B1s%C4%B1m%20Mah.%20%C3%87obançeşme%20E-5%2C%20Yan%20Yol%20No%3A%2014%2FA%2C%2034158%20Bak%C4%B1rköy%2F%C4%B0stanbul&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%) sepia(34%) hue-rotate(172deg) saturate(220%) brightness(0.86) contrast(1.02)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </motion.div>
              </div>

              <div className="mt-12 grid gap-y-12 lg:hidden">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="relative flex justify-center"
                >
                  <EarthOrb />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
                  className="w-full"
                >
                  <iframe
                    src="https://www.google.com/maps?q=Agenzion%20Web%20Studio%2C%20Atak%C3%B6y%207-8-9-10.%20K%C4%B1s%C4%B1m%20Mah.%20%C3%87obançeşme%20E-5%2C%20Yan%20Yol%20No%3A%2014%2FA%2C%2034158%20Bak%C4%B1rköy%2F%C4%B0stanbul&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%) sepia(34%) hue-rotate(172deg) saturate(220%) brightness(0.86) contrast(1.02)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[360px] w-full border-0"
                  />
                </motion.div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={`relative flex flex-col items-center justify-center overflow-hidden bg-neutral-950 border-t border-white/5 ${hideHeader ? 'py-12' : 'min-h-screen py-24'}`}>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        {showForm && !hideHeader && (
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'circOut' }}
                  className="text-4xl md:text-7xl font-bold brand-font tracking-tighter leading-tight text-white"
                >
                  {copy.homeHeadingLine1}
                </motion.h2>
              </div>
              <br className="hidden md:block" />
              <div className="inline-block">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'circOut' }}
                  className="text-4xl md:text-7xl font-bold brand-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#4592AF] to-[#E3C4A8] leading-tight"
                >
                  {copy.homeHeadingLine2}
                </motion.h2>
              </div>
            </motion.div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="max-w-4xl mx-auto mb-32">
            {renderFormContent('default')}
          </div>
        )}

        {/* --- LOCATION & MAP SECTION --- */}
        {showMap && (
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Address Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-4xl md:text-6xl font-black text-white brand-font mb-2">
                    İSTANBUL
                  </h3>
                  <div className="flex items-center gap-3 text-[#4592AF] font-mono text-sm tracking-widest">
                    <span className="w-2 h-2 bg-[#4592AF] rounded-full animate-pulse"></span>
                    MERKEZ OFİS
                  </div>
                </div>
                <div className="h-[1px] w-24 bg-white/20"></div>
                <div className="space-y-6">
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <MapPin className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg brand-font">
                        Levent, Büyükdere Cd. No:193
                      </p>
                      <p className="text-neutral-500 font-mono text-sm">34394 Şişli/İstanbul, Türkiye</p>
                      <p className="text-xs text-[#4592AF]/60 font-mono mt-1">
                        41.0082° N, 28.9784° E
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <Mail className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg brand-font">hello@agenzion.com</p>
                      <p className="text-neutral-500 font-mono text-sm">Proje talepleri & Kariyer</p>
                    </div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <Phone className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg brand-font">+90 (212) 555 0123</p>
                      <p className="text-neutral-500 font-mono text-sm">Pzt-Cum, 09:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Interactive Map Card */}
              <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] group">
                {/* 1. GOOGLE MAPS IFRAME */}
                {isMapActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-10 bg-neutral-900"
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.5520338886!2d28.8720968!3d41.0054958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2sIstanbul!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str"
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'grayscale(100%) sepia(34%) hue-rotate(172deg) saturate(220%) brightness(0.86) contrast(1.02)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                    <button
                      onClick={() => setIsMapActive(false)}
                      className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors z-20"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                )}

                {/* 2. STYLIZED OVERLAY */}
                <AnimatePresence>
                  {!isMapActive && (
                    <motion.div
                      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-0 z-20 w-full h-full"
                    >
                      <div
                        className="absolute inset-0 grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
                      >
                        <Image 
                          src="https://picsum.photos/seed/map/1200/800"
                          alt="Map"
                          fill
                          className="object-cover opacity-40"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#4592AF]/10 pointer-events-none">
                        <div className="w-full h-full rounded-full border border-[#4592AF]/20 animate-[spin_8s_linear_infinite] border-t-transparent border-l-transparent"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                        <div className="relative">
                          <div className="w-4 h-4 bg-[#4592AF] rounded-full z-10 relative shadow-[0_0_20px_rgba(69,146,175,0.8)]"></div>
                          <div className="absolute inset-0 bg-[#4592AF] rounded-full animate-ping opacity-75"></div>
                          <div className="absolute inset--4 bg-[#4592AF]/20 rounded-full animate-pulse"></div>
                        </div>
                        <button
                          onClick={() => setIsMapActive(true)}
                          className="group flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full text-xs font-mono text-white hover:bg-white hover:text-black transition-all hover:scale-105"
                        >
                          <Navigation
                            size={14}
                            className="text-[#4592AF] group-hover:text-black transition-colors"
                          />
                          <span className="tracking-widest">OFİSİ BUL</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Contact;
