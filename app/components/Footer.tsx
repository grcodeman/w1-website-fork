import Link from 'next/link';

const footerLinks = [
  { href: '/build', label: 'Bronco Build It' },
  { href: '/learn', label: 'Learn' },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Footer() {
  return (
    <footer className="bg-brown-deep text-text-on-dark">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 mb-6 text-sm text-text-on-dark/70"
        >
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-text-on-dark transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* div, not p: <address> is flow content and can't nest inside <p>. */}
          <div className="text-sm text-text-on-dark/80">
            &copy; {new Date().getFullYear()} W1 Startup Community |{' '}
            <address className="not-italic inline">
              <a href="mailto:w1@student.groups.wexchange.wmich.edu" className="underline">
                w1@student.groups.wexchange.wmich.edu
              </a>
            </address>
          </div>
          <p className="text-xs text-text-on-dark/50">
            This site uses Microsoft Clarity for analytics.{' '}
            <a
              href="https://privacy.microsoft.com/en-us/privacystatement"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-on-dark/80 transition-colors"
            >
              Microsoft Privacy Statement
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
