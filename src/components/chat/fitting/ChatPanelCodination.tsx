import { useState } from 'react';
import { codinationAtom } from '@/atoms/chatAtoms';
import { useAtomValue } from 'jotai';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Tag, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  category: string;
  tags: string[];
}

interface Cart {
  id: string;
  name: string;
  items: CartItem[];
  totalItems: number;
}

export default function ChatPanelCodination() {
  const codination = useAtomValue(codinationAtom);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [carts, setCarts] = useState<Cart[]>([
    {
      id: '1',
      name: '캐주얼 데일리 룩',
      totalItems: 3,
      items: [
        {
          id: '1',
          image: '/api/placeholder/300/400',
          title: '베이직 라운드넥 티셔츠',
          price: 29000,
          category: '상의',
          tags: ['베이직', '캐주얼', '데일리'],
        },
        {
          id: '2',
          image: '/api/placeholder/300/400',
          title: '슬림핏 데님 팬츠',
          price: 89000,
          category: '하의',
          tags: ['데님', '클래식', '편안함'],
        },
        {
          id: '3',
          image: '/api/placeholder/300/400',
          title: '캔버스 스니커즈',
          price: 65000,
          category: '신발',
          tags: ['스니커즈', '캐주얼', '편안함'],
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
          price: 120000,
          category: '상의',
          tags: ['정장', '비즈니스', '클래식'],
        },
        {
          id: '5',
          image: '/api/placeholder/300/400',
          title: '슬랙스 팬츠',
          price: 89000,
          category: '하의',
          tags: ['정장', '비즈니스', '세련됨'],
        },
        {
          id: '6',
          image: '/api/placeholder/300/400',
          title: '로퍼',
          price: 49000,
          category: '신발',
          tags: ['정장', '비즈니스', '클래식'],
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
          price: 75000,
          category: '아우터',
          tags: ['후드', '스포티', '편안함'],
        },
        {
          id: '8',
          image: '/api/placeholder/300/400',
          title: '조거 팬츠',
          price: 55000,
          category: '하의',
          tags: ['스포티', '편안함', '운동'],
        },
        {
          id: '9',
          image: '/api/placeholder/300/400',
          title: '운동화',
          price: 35000,
          category: '신발',
          tags: ['스포티', '편안함', '운동'],
        },
      ],
    },
  ]);

  const handleRemoveCart = (cartId: string) => {
    setCarts((prev) => prev.filter((cart) => cart.id !== cartId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="h-48 p-4 overflow-hidden bg-white border-t border-gray-200">
      <div className="relative h-full">
        {/* 스크롤 컨테이너 */}
        <div className="flex gap-4 h-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
          {carts.map((cart) => (
            <div
              key={cart.id}
              className="flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* 카드 헤더 */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{cart.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveCart(cart.id)}
                    className="w-6 h-6 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{cart.totalItems}개 아이템</span>
                </div>
              </div>

              {/* 아이템 리스트 */}
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      {/* 아이템 이미지 */}
                      <div className="relative w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 rounded-lg flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* 아이템 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            {item.category}
                          </span>
                        </div>

                        <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">{item.title}</h4>
                      </div>

                      {/* 가격 및 수량 */}
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">₩{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 카드 푸터 */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <Button className="w-full" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  피팅 시작
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 스크롤 인디케이터 */}
        {carts.length > 0 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {carts.map((_, index) => (
              <div key={index} className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" />
            ))}
          </div>
        )}
      </div>

      {/* 빈 상태 */}
      {carts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
            <ShoppingCart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">장바구니가 비어있습니다</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            AI와 대화하여 가상피팅에 사용할 옷 조합들을 추가해보세요
          </p>
          <Button size="sm">쇼핑 시작하기</Button>
        </div>
      )}
    </div>
  );
}


