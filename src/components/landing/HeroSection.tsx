import LucideIcon from '@/components/icons/LucideIcon';

export default function HeroSection() {
  const showOnboarding = true;
  return (
    <div
      className={`text-center transition-all duration-700 ease-out ${
        showOnboarding ? 'hidden' : 'transform translate-y-0 opacity-100'
      }`}
    >
      <div className="my-16">
        <div className="inline-flex items-center px-6 py-3 bg-white/80 text-blue rounded-full text-lg font-medium shadow-sm">
          <LucideIcon name={'Clock'} color={'blue-500'} className="w-5 h-5 mr-2 dark" />
          패션을 잘 모르겠다면?
        </div>

        <h2 className="text-7xl font-bold text-gray-900 my-24 leading-tight">
          <span className="text-blue font-">The First Take</span>
        </h2>
        <div className="text-2xl font-bold text-gray-900 mb-32 leading-tight font-sans">
          패션 전문가가 아니더라도
          <br />
          완벽한 한 벌을 찾을 수 있어요
        </div>
      </div>
    </div>
  );
}
