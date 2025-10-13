import LucideIcon from '@/components/ui/icons/LucideIcon';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className={`my-16 text-center transition-all duration-700 ease-out 'transform translate-y-0 opacity-100`}>
      <div className="w-full flex justify-center">
        <Image className="mx-3" src={'/TFT_icon.png'} alt={'logo'} width={60} height={60} />
      </div>

      <h2 className="text-7xl font-bold mt-16 leading-tight">The First Take</h2>
      <div className="text-2xl font-bold mb-16 leading-tight font-sans">
        <div className="inline-flex items-center text-lg">패션을 잘 모르는 사람들을 위한 AI 패션 추천 플랫폼</div>
      </div>
    </div>
  );
}
