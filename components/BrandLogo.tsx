'use client';

import React from 'react';
import Image from 'next/image';
import { motion, type MotionValue } from 'motion/react';

const DARK_LOGO_SRC = '/images/logo-koyu.png';
const LIGHT_LOGO_SRC = '/images/logo-acik.png';

type OpacityValue = number | MotionValue<number>;

interface BrandLogoProps {
  className?: string;
  darkOpacity?: OpacityValue;
  lightOpacity?: OpacityValue;
  priority?: boolean;
}

export default function BrandLogo({
  className = '',
  darkOpacity = 1,
  lightOpacity = 0,
  priority = false,
}: BrandLogoProps) {
  return (
    <div
      className={`relative h-8 w-[11.5rem] shrink-0 select-none md:h-9 md:w-[13rem] ${className}`}
      aria-label="Agenzion Web Studio"
    >
      <motion.div style={{ opacity: darkOpacity }} className="absolute inset-0">
        <Image
          src={DARK_LOGO_SRC}
          alt="Agenzion Web Studio"
          fill
          priority={priority}
          sizes="(min-width: 768px) 13rem, 11.5rem"
          className="object-contain object-left"
        />
      </motion.div>

      <motion.div style={{ opacity: lightOpacity }} className="absolute inset-0">
        <Image
          src={LIGHT_LOGO_SRC}
          alt="Agenzion Web Studio"
          fill
          priority={priority}
          sizes="(min-width: 768px) 13rem, 11.5rem"
          className="object-contain object-left"
        />
      </motion.div>
    </div>
  );
}
