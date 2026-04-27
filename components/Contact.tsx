'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import ShinyButton from './ShinyButton';
import ShimmerText from '@/components/ui/shimmer-text';
import useIsMobile from '@/lib/useIsMobile';

interface ContactProps {
  showForm?: boolean;
  showMap?: boolean;
  showMapContactLinks?: boolean;
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
    errorMessage: string;
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

const MapContactLinks = ({
  className = '',
  copy,
}: {
  className?: string;
  copy: ContactProps['copy'];
}) => {
  const links = [
    {
      label: 'studio@agenzion.com',
      href: 'mailto:studio@agenzion.com',
    },
    {
      label: '+90 554 433 0870',
      href: 'tel:+905544330870',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
      className={`grid gap-5 text-center md:grid-cols-2 ${className}`}
    >
      {links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={`group/contact-link block min-w-0 rounded-[8px] px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#4592AF]/60 ${
            index === 0 ? 'md:text-left' : 'md:text-right'
          }`}
        >
          <ShimmerText
            className="brand-font relative inline-block max-w-full whitespace-normal break-words pb-1 text-2xl font-bold text-[#E3C4A8] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#E3C4A8] after:transition-transform after:duration-300 after:ease-out group-hover/contact-link:after:scale-x-100 group-focus-visible/contact-link:after:scale-x-100 sm:text-4xl md:text-5xl"
            delay={index === 0 ? 0.4 : 0.9}
          >
            {link.label}
          </ShimmerText>
        </a>
      ))}
      <p className="brand-font mx-auto min-w-0 max-w-5xl break-words px-1 pt-1 text-base font-bold leading-relaxed text-white/76 sm:text-lg md:col-span-2 md:text-2xl">
        {copy.addressLine1} {copy.addressLine2}
      </p>
    </motion.div>
  );
};

const ContactMapVisual = ({
  showContactLinks = false,
  copy,
}: {
  showContactLinks?: boolean;
  copy: ContactProps['copy'];
}) => (
  <>
    <div className="mt-16 hidden lg:block">
      <div className="relative h-[470px]">
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
      {showContactLinks ? <MapContactLinks copy={copy} className="mt-6" /> : null}
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
      {showContactLinks ? <MapContactLinks copy={copy} /> : null}
    </div>
  </>
);

const Contact: React.FC<ContactProps> = ({
  showForm = true,
  showMap = true,
  showMapContactLinks = false,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pathname = usePathname();
  const formId = React.useId();
  const nameInputId = `${formId}-name`;
  const emailInputId = `${formId}-email`;
  const messageInputId = `${formId}-message`;

  const updateField = (field: 'name' | 'email' | 'message', value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      message: formState.message.trim(),
      sourcePath: pathname,
    };

    if (!payload.name || !payload.email) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Contact form request failed.');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form submit error:', error);
      setIsSubmitting(false);
      setSubmitError(copy.errorMessage);
    }
  };

  const renderFormContent = (variant: 'default' | 'page') => {
    const fieldBaseDelay = variant === 'page' ? 0.55 : 0.22;
    const fieldLineColor = variant === 'page' ? '' : 'bg-white/20';
    const fieldReveal = (index: number) => ({
      initial: { opacity: 0, y: 14 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.7 },
      transition: { duration: 0.55, delay: fieldBaseDelay + index * 0.1, ease: 'easeOut' as const },
    });
    const lineDelay = (index: number) => fieldBaseDelay + 0.28 + index * 0.1;

    return (
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
            onClick={() => {
              setIsSuccess(false);
              setSubmitError(null);
            }}
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
              <motion.label
                {...fieldReveal(0)}
                htmlFor={nameInputId}
                className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]"
              >
                {copy.nameLabel}
              </motion.label>
              <motion.div {...fieldReveal(1)}>
                <input
                  id={nameInputId}
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder={copy.namePlaceholder}
                  className="brand-font w-full bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl"
                />
              </motion.div>
              <RevealLine delay={lineDelay(0)} className={`w-full ${fieldLineColor}`} />
            </div>
            <div className="group relative pb-4">
              <motion.label
                {...fieldReveal(2)}
                htmlFor={emailInputId}
                className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]"
              >
                {copy.emailLabel}
              </motion.label>
              <motion.div {...fieldReveal(3)}>
                <input
                  id={emailInputId}
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="brand-font w-full bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl"
                />
              </motion.div>
              <RevealLine delay={lineDelay(1)} className={`w-full ${fieldLineColor}`} />
            </div>
          </div>
          <div className="group relative mb-8 flex-1 pb-4">
            <motion.label
              {...fieldReveal(4)}
              htmlFor={messageInputId}
              className="mb-2 block text-xs font-mono uppercase tracking-widest text-neutral-500 transition-colors group-focus-within:text-[#4592AF]"
            >
              {copy.messageLabel}
            </motion.label>
            <motion.div {...fieldReveal(5)}>
              <textarea
                id={messageInputId}
                name="message"
                rows={variant === 'page' ? 3 : 3}
                value={formState.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder={copy.messagePlaceholder}
                className="brand-font w-full resize-none bg-transparent py-4 text-xl text-white placeholder-neutral-700 focus:outline-none md:text-2xl"
              />
            </motion.div>
            <RevealLine delay={lineDelay(2)} className={`w-full ${fieldLineColor}`} />
          </div>
          <div className="flex flex-col items-end gap-3">
            {submitError ? (
              <p role="alert" className="max-w-md text-right text-sm text-[#F2B6B6]">
                {submitError}
              </p>
            ) : null}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.55, delay: fieldBaseDelay + 0.72, ease: 'easeOut' }}
            >
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
            </motion.div>
          </div>
        </motion.form>
      )}
      </AnimatePresence>
    );
  };

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
                      rel="noopener noreferrer"
                      className="block max-w-full transition-colors hover:text-[#4592AF]"
                    >
                      <p className="brand-font max-w-full break-words text-lg font-bold text-white">
                        {copy.addressLine1}
                      </p>
                    </a>
                    <p className="max-w-full break-words text-sm font-mono text-white/48">
                      {copy.addressLine2}
                    </p>
                  </div>
                  <RevealLine delay={0.9} className="w-full" />
                </div>
                <div className="relative flex gap-4 pb-6">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <Mail className="text-white/70" />
                  </div>
                  <div>
                    <a
                      href="mailto:studio@agenzion.com"
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
            <ContactMapVisual copy={copy} showContactLinks={showMapContactLinks} />
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
          <div className={`max-w-4xl mx-auto ${showMap ? 'mb-0' : 'mb-32'}`}>
            {renderFormContent('default')}
          </div>
        )}

        {showMap && (
          <div className="mx-auto max-w-7xl px-2 pb-20 md:px-4">
            <ContactMapVisual copy={copy} showContactLinks={showMapContactLinks} />
          </div>
        )}

      </div>
    </section>
  );
};

export default Contact;
