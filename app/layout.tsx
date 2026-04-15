import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "W1 @ WMU",
  description: "A student startup community across Western Michigan and beyond.",
  icons: {
    icon: [{ url: '/w1_logo.png' }],
  },
  openGraph: {
    title: "W1 @ WMU",
    description: "A student startup community across Western Michigan and beyond.",
    url: "https://www.w1build.com",
    siteName: "W1 @ WMU",
    images: [{ url: "/images/cards/w1_hero_og.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "W1 @ WMU",
    description: "A student startup community across Western Michigan and beyond.",
    images: ["/images/cards/w1_hero_og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${inter.variable} font-sans antialiased`}>
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
