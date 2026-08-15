'use client';

import React from 'react';
import Image from 'next/image';

interface RotatingBadgeProps {
  text: string;
  scrollTargetId?: string;
  className?: string;
}

export default function RotatingBadge({
  text,
  scrollTargetId,
  className = 'fixed top-20 right-4 md:top-24 md:right-8',
}: RotatingBadgeProps) {
  const onClick = scrollTargetId
    ? () => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })
    : undefined;

  const getRepetitions = (t: string) => {
    if (t.length <= 4) return 8;
    if (t.length <= 6) return 6;
    return 5;
  };

  const repetitions = getRepetitions(text);
  const offsetIncrement = 100 / repetitions;

  // The rotating ring repeats the text visually, so it lives in an aria-hidden
  // wrapper with an invisible button overlay — a label on a control containing
  // the repeated text could never match its visible content (WCAG 2.5.3).
  return (
    <div
      className={`${className} w-[96px] h-[96px] md:w-[124px] md:h-[124px] lg:w-[160px] lg:h-[160px] z-40`}
    >
      <div aria-hidden="true" className="w-full h-full">
        <div className="rotate-badge w-full h-full relative">
        <Image
          src="/images/badge/badge.png"
          alt=""
          fill
          sizes="140px"
          className="object-contain"
        />
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0" aria-hidden="true">
          <defs>
            <path
              id="rotating-badge-circle"
              d="M 100, 30 a 70,70 0 1,1 0,140 a 70,70 0 1,1 0,-140"
            />
          </defs>
          {Array.from({ length: repetitions }).map((_, i) => (
            <text
              key={i}
              fill="#FFFFFF"
              style={{ fontSize: '16px', fontWeight: 700 }}
            >
              <textPath
                href="#rotating-badge-circle"
                startOffset={`${i * offsetIncrement}%`}
              >
                {text}
              </textPath>
            </text>
          ))}
        </svg>
      </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Jump to ${text.toLowerCase()} section`}
          className="absolute inset-0 cursor-pointer"
        />
      )}
    </div>
  );
}
