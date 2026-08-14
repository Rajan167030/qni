import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FooterSection } from '@/components/landing/footer-section'
import { CurtainTransition } from '@/components/ui/curtain-transition'
import './globals.css'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: {
    default: 'Quantum Nexus Global (QNG) — Advancing Quantum Computing & AI',
    template: '%s | Quantum Nexus Global (QNG)',
  },
  description: 'Quantum Nexus Global is a premier quantum computing R&D network advancing quantum algorithms, NISQ error mitigation, enterprise cloud QPU simulators, and AI infrastructure worldwide.',
  keywords: [
    'Quantum Computing',
    'Quantum Nexus Global',
    'QNG',
    'Qiskit',
    'VQE Algorithms',
    'Quantum AI',
    'NISQ Error Mitigation',
    'Quantum Infrastructure',
    'Quantum Research India',
  ],
  authors: [{ name: 'Quantum Nexus Global Team' }],
  creator: 'Quantum Nexus Global',
  publisher: 'Quantum Nexus Global',
  metadataBase: new URL('https://www.quantumnexusglobal.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Quantum Nexus Global (QNG) — Advancing Quantum Computing & AI',
    description: 'Premier quantum computing R&D network advancing quantum algorithms, NISQ error mitigation, enterprise cloud QPU simulators, and AI infrastructure worldwide.',
    url: 'https://www.quantumnexusglobal.org',
    siteName: 'Quantum Nexus Global',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Quantum Nexus Global Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum Nexus Global (QNG)',
    description: 'Advancing quantum computing R&D, quantum algorithms, and AI infrastructure globally.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Quantum Nexus Global',
    alternateName: 'QNG',
    url: 'https://www.quantumnexusglobal.org',
    logo: 'https://www.quantumnexusglobal.org/logo.png',
    description: 'Advancing quantum computing research, VQE algorithms, NISQ error mitigation, and quantum AI infrastructure globally.',
    sameAs: [
      'https://linkedin.com/company/qnexusglobal',
      'https://twitter.com/qnexusglobal',
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XVFLLRLN56" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-XVFLLRLN56');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <CurtainTransition />
        {children}
        <FooterSection />
        <Analytics />
      </body>
    </html>
  );
}
