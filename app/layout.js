import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Hidden in Plain Sight - Secret Message Extractor',
  description: 'Extract secret messages encoded in images. Upload an image to reveal hidden text embedded.',
  keywords: ['steganography', 'secret message', 'image decoder', 'data embedding', 'hidden message', 'data extraction', 'cybersecurity'],
  authors: [{ name: 'Arpan Mandal' }],
  creator: 'Arpan Mandal',
  publisher: 'Arpan Mandal',
  applicationName: 'Secret Message Extractor',
  category: 'Cybersecurity',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Secret Message Extractor',
    title: 'Hidden in Plain Sight - Extract Secret Messages from Images',
    description: 'Advanced data extraction tool. Upload an image to reveal hidden messages embedded within.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Secret Message Extractor - Data Extraction Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden in Plain Sight - Secret Message Extractor',
    description: 'Extract secret messages encoded in images using advanced steganographic data extraction.',
    creator: '@enthusiasticodr',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
