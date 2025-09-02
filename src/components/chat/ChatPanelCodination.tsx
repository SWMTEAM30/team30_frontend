import { useEffect } from 'react';
import { codinationsAtom } from '@/atoms/chatAtoms';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function ChatPanelCodination() {
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  useEffect(() => {
    setCodinations([
      {
        id: '1',
        name: '캐주얼 데일리 룩',
        items: [
          {
            id: '1',
            image: '/api/placeholder/300/400',
            title: '베이직 라운드넥 티셔츠',
          },
          {
            id: '2',
            image: '/api/placeholder/300/400',
            title: '슬림핏 데님 팬츠',
          },
          {
            id: '3',
            image: '/api/placeholder/300/400',
            title: '캔버스 스니커즈',
          },
        ],
      },
      {
        id: '2',
        name: '비즈니스 캐주얼',
        totalItems: 4,
        items: [
          {
            id: '4',
            image: '/api/placeholder/300/400',
            title: '옥스포드 셔츠',
          },
          {
            id: '5',
            image: '/api/placeholder/300/400',
            title: '슬랙스 팬츠',
          },
          {
            id: '6',
            image: '/api/placeholder/300/400',
            title: '로퍼',
          },
        ],
      },
      {
        id: '3',
        name: '스포티 룩',
        totalItems: 3,
        items: [
          {
            id: '7',
            image: '/api/placeholder/300/400',
            title: '후드 집업',
          },
          {
            id: '8',
            image: '/api/placeholder/300/400',
            title: '조거 팬츠',
          },
          {
            id: '9',
            image: '/api/placeholder/300/400',
            title: '운동화',
          },
        ],
      },
    ]);
  }, []);

  const handleRemoveCart = (codiId: string) => {
    setCodinations((prev: any[]) => prev.filter((codi) => codi.id !== codiId));
  };

  if (codinations.length === 0)
    return (
      <div className="h-1/3 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">선택된 조합이 없습니다.</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          AI와 대화하여 가상피팅에 사용할 옷 조합들을 추가해보세요
        </p>
      </div>
    );

  return (
    <div className="h-1/3 p-4 overflow-hidden flex gap-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
      {codinations.map((cart) => (
        <div
          key={cart.id}
          className="w-72 h-104 bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 flex flex-col"
        >
          {/* 카드 헤더 */}
          <div className="p-4 h-1/7 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{cart.items.length}개 아이템</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveCart(cart.id)}
                className="w-6 h-6 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 아이템 리스트 */}
          <div className="h-5/7 flex-1 p-3 overflow-y-auto">
            <div className="space-y-2">
              {cart.items.map((item: any[], key: number) => (
                <div key={key} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  {/* 아이템 이미지 */}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-lg flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 푸터 */}
          <div className="h-1/7 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <Button className="w-full h-full rounded-b-2xl rounded-t-none bg-navy" size="sm">
              피팅 시작
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
