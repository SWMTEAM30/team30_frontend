import FittingCard from '@/components/chat/fitting/FittingCard';
import FittingDetail from '@/components/chat/fitting/FittingDetail';

export default function FittingPanel() {

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
        {/* 왼쪽: 피팅 결과 */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 min-h-0">
            <FittingCard />
          </div>
        </div>
        
        {/* 오른쪽: 상세 정보 */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 min-h-0">
            <FittingDetail />
          </div>
        </div>
      </div>
    </div>
  );
}
