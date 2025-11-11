import HeroSection from '@/components/landing/HeroSection';
import NextChat from '@/components/landing/NextChat';
import Explanation from '@/components/landing/Explanation';
import Image from 'next/image';
import Features from '@/components/landing/Features';
import FAQ from '@/components/landing/FAQ';
import JsonLd from '@/components/seo/JsonLd';
import { createOrganizationSchema, createWebSiteSchema, createSoftwareApplicationSchema } from '@/lib/schema';

export default function Home() {
  const organizationSchema = createOrganizationSchema(
    'The First Take',
    'https://the-first-take.com',
    '/TFT_icon.png',
    'AI가 당신만의 완벽한 스타일을 찾아드립니다. 복잡한 옷 고르기, 이제 끝! 상황과 체형을 고려한 딱 한 벌만 추천받으세요.',
  );

  const webSiteSchema = createWebSiteSchema(
    'The First Take',
    'https://the-first-take.com',
    'AI 패션 스타일 어시스턴트 - 맞춤형 스타일 추천 서비스',
  );

  const softwareApplicationSchema = createSoftwareApplicationSchema(
    'The First Take',
    'AI가 당신만의 완벽한 스타일을 찾아드립니다. 복잡한 옷 고르기, 이제 끝! 상황과 체형을 고려한 딱 한 벌만 추천받으세요.',
    'https://the-first-take.com',
    '/TFT_icon.png',
  );

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <JsonLd data={softwareApplicationSchema} />
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
    </>
  );
}
