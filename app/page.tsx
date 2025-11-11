import HeroSection from '@/components/landing/HeroSection';
import NextChat from '@/components/landing/NextChat';
import Explanation from '@/components/landing/Explanation';
import Image from 'next/image';
import Features from '@/components/landing/Features';
import FAQ from '@/components/landing/FAQ';

export default function Home() {
  return (
    <main className="font-sans">
      <section className="h-screen flex items-center justify-center relative ">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-blue dark:bg-blue-800 -z-20 pointer-events-none">
          <Image className="object-cover opacity-60 dark:opacity-30" src={'/logo1.png'} alt={'logo'} fill />
        </div>
        <div className="absolute inset-0 -z-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto pb-24 px-4 w-full bg-white dark:bg-slate-800 rounded-4xl shadow-2xl">
          <HeroSection />
          <NextChat />
        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <a
            href="#about"
            className="group inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <span className="text-sm md:text-base">아래로 스크롤하면 제품 설명을 볼 수 있어요</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
      <Explanation />
      <Features />
      <FAQ />

      <footer className="border-t bg-blue-700 border-border m-8 p-8 text-center text-md text-muted-foreground">
        <p>© 2025 the first take. All rights reserved.</p>
      </footer>
    </main>
  );
}
