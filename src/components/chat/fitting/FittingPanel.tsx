import FittingCard from '@/components/chat/fitting/FittingCard';
import FittingDetail from '@/components/chat/fitting/FittingDetail';

export default function FittingPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 overflow-y-auto">
        <FittingCard />
        <FittingDetail />
      </div>
    </div>
  );
}
