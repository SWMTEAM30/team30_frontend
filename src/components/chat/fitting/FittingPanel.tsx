import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart, RotateCcw, Star } from 'lucide-react';

interface FittingResult {
  id: string;
  imageUrl: string;
  outfitName: string;
  description: string;
  confidence: number;
  items: {
    category: string;
    name: string;
    brand: string;
    price: number;
  }[];
  style: string;
  occasion: string;
  whyRecommend: string;
  tags: string[];
}

export default function FittingPanel() {
  const [likedOutfit, setLikedOutfit] = useState(false);
  const [currentView, setCurrentView] = useState<'front' | 'back' | 'side'>('front');

  // 임시 데이터 (실제로는 props나 API에서 받아올 예정)
  const fittingResult: FittingResult = {
    id: '1',
    imageUrl: '/api/placeholder/500/700',
    outfitName: '캐주얼 데일리 룩',
    description:
      '편안하면서도 스타일리시한 일상복 조합으로, 데이트부터 친구들과의 모임까지 다양한 상황에서 활용할 수 있는 완벽한 룩입니다.',
    confidence: 0.92,
    items: [
      {
        category: '상의',
        name: '베이직 라운드넥 티셔츠',
        brand: 'Uniqlo',
        price: 29000,
      },
      {
        category: '하의',
        name: '슬림핏 데님 팬츠',
        brand: "Levi's",
        price: 89000,
      },
      {
        category: '신발',
        name: '캔버스 스니커즈',
        brand: 'Converse',
        price: 65000,
      },
    ],
    style: '미니멀 캐주얼',
    occasion: '데일리, 데이트, 친구 모임',
    whyRecommend:
      '이 조합은 편안함과 스타일을 동시에 만족시키는 완벽한 밸런스를 제공합니다. 베이직한 티셔츠와 클래식한 데님 팬츠의 조합은 시간이 지나도 변치 않는 스타일로, 다양한 상황에서 활용할 수 있습니다.',
    tags: ['캐주얼', '데일리', '편안함', '스타일리시'],
  };

  const handleLike = () => {
    setLikedOutfit(!likedOutfit);
  };

  const handleDownload = () => {
    console.log('Downloading outfit');
  };

  const handleShare = () => {
    console.log('Sharing outfit');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* 메인 콘텐츠 */}
      <div className="h-full p-4 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* 왼쪽: 피팅 이미지 */}
          <div className="flex flex-col h-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex-1 min-h-0">
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-slate-400 dark:text-slate-500 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-base font-medium">피팅 이미지</p>
                    <p className="text-sm mt-1">현재 뷰: 정면</p>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleLike}
                    className="w-10 h-10 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
                  >
                    <Heart className={`w-5 h-5 ${likedOutfit ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleDownload}
                    className="w-10 h-10 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleShare}
                    className="w-10 h-10 bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="flex flex-col space-y-4 h-full overflow-y-auto">
            {/* 기본 정보 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{fittingResult.outfitName}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{fittingResult.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {fittingResult.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 구성 아이템 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">구성 아이템</h4>
              <div className="space-y-2">
                {fittingResult.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.category}</span>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{item.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">₩{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 스타일 정보 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">스타일 정보</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">스타일</span>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{fittingResult.style}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">활용 상황</span>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{fittingResult.occasion}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">추천 이유</span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{fittingResult.whyRecommend}</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 mt-2">
              <Button className="flex-1" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 피팅하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
