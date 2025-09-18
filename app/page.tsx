import LucideIcon from '@/components/ui/icons/LucideIcon';
import Explanation from '@/components/landing/Explanation';
import Onboarding from '@/components/landing/Onboarding';
import RoomList from '@/components/landing/RoomList';
import HeroSection from '@/components/landing/HeroSection';
import NextChat from '@/components/landing/NextChat';

export default function Home() {
  return (
    <div className="bg-beige-400 font-sans">
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <HeroSection />
          <NextChat />
          {/* <Onboarding /> */}

          {/* 아래 정보 알려주는 지표 */}
          {/* <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-blue/10 text-blue rounded-2xl">
              <LucideIcon name={'ArrowDown'} color="blue-500" className="w-6 h-6 mr-3 animate-bounce" />
              <span className="text-lg font-semibold">아래에서 더 많은 정보를 확인하세요!</span>
            </div>
          </div> */}
        </div>
      </div>
      <RoomList />
      {/* <Explanation /> */}
    </div>
  );
}
