import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from 'next/font/google';
import Script from 'next/script';
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#6C4023",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.w1build.com"),
  title: {
    default: "W1 @ WMU — Student Startup Community in Kalamazoo, MI",
    template: "%s | W1 @ WMU",
  },
  description:
    "W1 is the student startup community at Western Michigan University — build nights, workshops, and founders shipping real products in Kalamazoo and beyond.",
  applicationName: "W1 @ WMU",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "W1 @ WMU — Student Startup Community in Kalamazoo, MI",
    description:
      "W1 is the student startup community at Western Michigan University — build nights, workshops, and founders shipping real products in Kalamazoo and beyond.",
    url: "https://www.w1build.com",
    siteName: "W1 @ WMU",
    locale: "en_US",
    images: [
      {
        url: "/images/cards/w1_hero_og.jpg",
        width: 1200,
        height: 630,
        alt: "Students at a W1 build night in a Western Michigan University lecture hall, with the W1 logo.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "W1 @ WMU — Student Startup Community in Kalamazoo, MI",
    description:
      "W1 is the student startup community at Western Michigan University — build nights, workshops, and founders shipping real products in Kalamazoo and beyond.",
    images: ["/images/cards/w1_hero_og.jpg"],
  },
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.w1build.com/#organization',
      name: 'W1',
      alternateName: 'W1 @ WMU',
      url: 'https://www.w1build.com',
      logo: 'https://www.w1build.com/w1_logo.png',
      description:
        'A student startup community based at Western Michigan University in Kalamazoo, connecting student founders across Western Michigan and beyond.',
      location: {
        '@type': 'Place',
        name: 'Western Michigan University',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kalamazoo',
          addressRegion: 'MI',
          addressCountry: 'US',
        },
      },
      sameAs: [
        'https://www.instagram.com/developerclubwmu/',
        'https://discord.com/invite/G9yE5s6NFM',
        'https://www.linkedin.com/company/w1build/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.w1build.com/#website',
      name: 'W1 @ WMU',
      url: 'https://www.w1build.com',
      description: 'A student startup community across Western Michigan and beyond.',
      publisher: { '@id': 'https://www.w1build.com/#organization' },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${instrumentSerif.variable} ${inter.variable} font-sans antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-warm-white"
        >
          Skip to content
        </a>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "te0c41vr61");
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
