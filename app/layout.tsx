import type { Metadata } from 'next';
import './globals.css';
import { plus_jakarta_sans, noto_sans_kr } from 'app/fonts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  const queryClient = new QueryClient();
  return (
    <html lang="ko">
      <body className={`${plus_jakarta_sans.variable} ${noto_sans_kr.variable} antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </main>
      </body>
    </html>
  );
}
