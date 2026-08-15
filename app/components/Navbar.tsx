'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNextSession } from '@/data/bronco-build-it-links';

const navLinks = [
  { href: '/learn', label: 'Learn' },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const session = getNextSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      aria-label="Main"
      className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-border/50 transition-all duration-300"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/w1_logo.png" alt="W1 @ WMU home" width={32} height={32} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/build"
              className={`text-[15px] font-medium hover:underline ${
                pathname === '/build' ? 'text-wmu-brown' : 'text-text-secondary'
              }`}
            >
              Bronco Build It
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium hover:underline ${
                  pathname === link.href ? 'text-wmu-brown' : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Get Involved dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-wmu-gold text-brown-deep text-sm font-semibold rounded-lg cursor-pointer"
              >
                Get Involved
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-20">
                  {session && (
                    <a
                      href={session.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium bg-black text-white"
                    >
                      Join Event
                      <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <a
                    href="https://discord.com/invite/G9yE5s6NFM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium bg-[#5865F2] text-white"
                  >
                    Join Discord
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/build"
              onClick={() => setMobileOpen(false)}
              className={`block text-[15px] font-medium hover:underline ${
                pathname === '/build' ? 'text-wmu-brown' : 'text-text-secondary'
              }`}
            >
              Bronco Build It
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-[15px] font-medium text-text-secondary hover:underline"
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <a
                href={session.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[15px] font-medium text-text-secondary hover:underline"
              >
                Join Event
              </a>
            )}
            <a
              href="https://discord.com/invite/G9yE5s6NFM"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[15px] font-medium text-text-secondary hover:underline"
            >
              Join Discord
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
