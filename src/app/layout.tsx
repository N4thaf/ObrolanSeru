import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obrolanseru.com"),
  title: {
    default: "ObrolanSeru - Game Kartu Obrolan, Truth or Dare & Deep Talk Online",
    template: "%s | ObrolanSeru",
  },
  description: "Mainkan ObrolanSeru gratis! Game kartu pertanyaan seru, Truth or Dare, icebreaker nongkrong, dan deep talk pasangan online. Tanpa perlu download atau install aplikasi!",
  keywords: [
    "game kartu obrolan",
    "game truth or dare online indonesia",
    "game nongkrong gratis",
    "pertanyaan deep talk pasangan",
    "game ice breaking kumpul teman",
    "obrolanseru",
    "game kartu indonesia online",
    "pertanyaan kenalan online",
    "game pasangan romantis",
    "game kumpul keluarga",
  ],
  authors: [{ name: "ObrolanSeru Team", url: "https://obrolanseru.com" }],
  creator: "ObrolanSeru",
  publisher: "ObrolanSeru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://obrolanseru.com",
  },
  openGraph: {
    title: "ObrolanSeru - Game Kartu Obrolan & Truth or Dare Online Gratis",
    description: "Cairkan suasana nongkrong dan kumpul bareng! Game kartu pertanyaan seru, Truth or Dare, dan deep talk pasangan gratis tanpa install.",
    url: "https://obrolanseru.com",
    siteName: "ObrolanSeru",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://obrolanseru.com/favicon-192.png",
        width: 192,
        height: 192,
        alt: "ObrolanSeru Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ObrolanSeru - Game Kartu Obrolan & Truth or Dare Online",
    description: "Cairkan suasana nongkrong bareng teman, pasangan, atau keluarga. Mainkan game kartu obrolan gratis tanpa download!",
    images: ["https://obrolanseru.com/favicon-192.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-192.png?v=10", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png?v=10", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg?v=10", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png?v=10",
    apple: "/apple-touch-icon.png?v=10",
  },
  verification: {
    google: "dqwSBKGQVrOZZeC7OxJ675M5hsV-05fnAWfA0xDKvBw",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ObrolanSeru",
  "url": "https://obrolanseru.com",
  "description": "Game kartu pertanyaan obrolan seru, Truth or Dare, icebreaker nongkrong, dan deep talk pasangan online gratis tanpa install.",
  "applicationCategory": "GameApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "IDR"
  },
  "inLanguage": "id"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} h-full antialiased`}>
      <head>
        <meta name="google-site-verification" content="dqwSBKGQVrOZZeC7OxJ675M5hsV-05fnAWfA0xDKvBw" />
        <link rel="icon" href="/favicon-192.png?v=10" sizes="192x192" type="image/png" />
        <link rel="icon" href="/favicon.png?v=10" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=10" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=10" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HN3Q461R7H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HN3Q461R7H');
          `}
        </Script>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
