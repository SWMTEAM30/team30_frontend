import Onboarding from '@/components/landing/Onboarding';
import HeroSection from '@/components/landing/HeroSection';
import RoomHistoryCardList from '@/components/landing/RoomHistoryCardList';

export default function Home() {
  return (
    <div className="bg-beige-400 font-sans">
      <div className="flex justify-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <HeroSection />
          <Onboarding />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <RoomHistoryCardList />
        </div>
      </div>
    </div>
  );
}
