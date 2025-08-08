import type { Metadata } from 'next';
import './globals.css';
import { plus_jakarta_sans, noto_sans_kr } from 'app/fonts';
import { Provider as JotaiProvider } from 'jotai';
import QueryProvider from 'app/providers';
import { GoogleAnalytics } from '@next/third-parties/google';
import AuthJotaiInitializer from '@/components/auth/AuthJotaiInitializer';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'The First Take - AI 패션 스타일 어시스턴트',
  description:
    'AI가 당신만의 완벽한 스타일을 찾아드립니다. 복잡한 옷 고르기, 이제 끝! 상황과 체형을 고려한 딱 한 벌만 추천받으세요.',
  keywords:
    'AI 패션, 스타일 추천, 옷 고르기, 패션 어시스턴트, 맞춤 코디, 패션 AI, 스타일링, 옷 추천, 패션 고민, AI 스타일',
  authors: [{ name: 'The First Take' }],
  creator: 'The First Take',
  publisher: 'The First Take',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://the-first-take.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The First Take - AI 패션 스타일 어시스턴트',
    description: 'AI가 당신만의 완벽한 스타일을 찾아드립니다. 복잡한 옷 고르기, 이제 끝!',
    url: 'https://the-first-take.com',
    siteName: 'The First Take',
    images: [
      {
        url: '/TFT_icon.png',
        width: 1200,
        height: 630,
        alt: 'The First Take - AI 패션 스타일 어시스턴트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The First Take - AI 패션 스타일 어시스턴트',
    description: 'AI가 당신만의 완벽한 스타일을 찾아드립니다. 복잡한 옷 고르기, 이제 끝!',
    images: ['/TFT_icon.png'],
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
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#27548a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The First Take" />
        <link rel="apple-touch-icon" href="/TFT_icon.png" />
      </head>
      <body className={`${plus_jakarta_sans.variable} ${noto_sans_kr.variable} antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">
          <JotaiProvider>
            <QueryProvider>
              <AuthJotaiInitializer />
              {children}
            </QueryProvider>
          </JotaiProvider>
        </main>
        <GoogleAnalytics gaId="G-LS5SN8G0F6" />
      </body>
    </html>
  );
}
