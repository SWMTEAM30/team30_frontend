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
        </div>
      </div>
      {/* <RoomList /> */}
    </div>
  );
}
