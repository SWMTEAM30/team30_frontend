import { codinationsAtom } from '@/atoms/chatAtoms';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function ChatPanelCodination() {
  const [codinations, setCodinations] = useAtom(codinationsAtom);

  const handleRemoveCart = (codi_ind: number) => {
    setCodinations((prev: Codination[]) => prev.filter((_, ind) => ind != codi_ind));
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
      {codinations.map((cart, key) => (
        <div
          key={key}
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
              {cart.items.map((product: ClosetCloth, key: number) => (
                <div key={key} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  {/* 아이템 이미지 */}
                  <Image className="w-16 h-16" src={product.url} alt={product.name} width={16} height={16} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">{product.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 푸터 */}
          <div className="h-1/7 border-t border-blue-200 bg-blue-50 dark:bg-slate-700/50">
            <Button className="w-1/2 h-full rounded-bl-2xl rounded-br-none rounded-t-none bg-navy font-bold" size="sm">
              피팅 시작
            </Button>
            <Button
              className="w-1/2 h-full rounded-br-2xl rounded-bl-none rounded-t-none bg-yellow text-navy font-bold"
              size="sm"
              onClick={() => {}}
            >
              수정
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
