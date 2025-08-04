import LucideIcon from '@/components/icons/LucideIcon';
import Explanation from '@/components/landing/Explanation';
import HeroSection from '@/components/landing/HeroSection';
import Onboarding from '@/components/landing/Onboarding';

export default function Home() {
  return (
    <div className="bg-beige-400 font-sans">
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          {/* Hero Section - slides up when onboarding starts */}
          <HeroSection />
          <Onboarding />
          {/* Scroll hint message - moved to first section */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-blue/10 text-blue rounded-2xl">
              <LucideIcon name={'ArrowDown'} color="blue-500" className="w-6 h-6 mr-3 animate-bounce" />
              <span className="text-lg font-semibold">아래에서 더 많은 정보를 확인하세요!</span>
            </div>
          </div>
        </div>
      </div>
      <Explanation />
    </div>
  );
}
