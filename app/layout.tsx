import type { Metadata } from 'next';
import './globals.css';
import { plus_jakarta_sans, noto_sans_kr } from 'app/fonts';
import QueryProvider from 'app/providers';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'The First Take',
  description: 'Software Maestro',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${plus_jakarta_sans.variable} ${noto_sans_kr.variable} antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </body>
    </html>
  );
}
