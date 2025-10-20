import MessageParser from '@/components/chat/message/balloon/MessageParser';
import ClothModal from '@/components/chat/modal/ClothModal';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { elapsedTimeText } from '@/lib/utils';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { activeCodinationAtom, codinationsAtom, panelAtom, closetAtom } from '@/atoms/chatAtoms';
import { useCodination } from '@/hooks/useCodination';
import { getChatProduct } from '@/api/chatAPI';
import { useClosetStorage } from '@/hooks/useClosetStorage';
import { useCodinationStorage } from '@/hooks/useCodinationStorage';

export default function MessageBalloon({
  message,
  isMainPost = false,
  replies = [],
}: {
  message: Message;
  isMainPost?: boolean;
  replies?: Message[];
}) {
  const isUserId = !!message.user;
  // 본 글은 사용자, 댓글은 AI
  const isUser = isMainPost ? true : false;
  let agentThumbnail = '/model_image.jpg';
  if (message.agent?.agentname) {
    if (message.agent.agentname.includes('스타일')) agentThumbnail = '/ai/ai_style.webp';
    if (message.agent.agentname.includes('컬러')) agentThumbnail = '/ai/ai_color.webp';
    if (message.agent.agentname.includes('코디네이터')) agentThumbnail = '/ai/ai_codi.webp';
  }

  const setPanel = useSetAtom(panelAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const { addNewCodination } = useCodination();
  const [isRepliesCollapsed, setIsRepliesCollapsed] = useState(false);
  const [locallySavedKeys, setLocallySavedKeys] = useState<Set<string>>(new Set());
  
  // 스토리지 훅 사용
  const { closet, addClothToCloset } = useClosetStorage();
  const { codinations, addCodination } = useCodinationStorage();

  const makeProductsKey = useCallback((products: Product[]) => {
    const ids = products
      .map((p) => p.product_id || p.product_url)
      .filter(Boolean)
      .sort();
    return ids.join('|');
  }, []);

  const makeCodinationKey = useCallback((c: Codination) => {
    const ids = c.cloths
      .map((cl) => cl.id)
      .filter(Boolean)
      .sort();
    return ids.join('|');
  }, []);

  const savedKeysFromStore = useMemo(() => {
    const s = new Set<string>();
    for (const c of codinations) {
      s.add(makeCodinationKey(c));
    }
    return s;
  }, [codinations, makeCodinationKey]);

  // 기존 코디네이션과 동일한 착장인지 비교 (옷 ID 기준, 순서 무관)
  const isSameCodination = (a: Codination, b: Codination) => {
    if (a.cloths.length !== b.cloths.length) return false;
    const aIds = a.cloths.map((c) => c.id).sort();
    const bIds = b.cloths.map((c) => c.id).sort();
    return aIds.every((id, idx) => id === bIds[idx]);
  };

  const addCodinationFromProducts = useCallback(
    async (products: Product[]) => {
      if (!products || products.length === 0) return;

      const results = await Promise.all(products.map((p) => getChatProduct(p)));
      const clothsMap = new Map<string, ClosetCloth>();
      const failedProducts: Product[] = [];
      
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res.status === 'success' && res.data) {
          const cloth = res.data as ClosetCloth;
          clothsMap.set(cloth.id, cloth);
        } else {
          failedProducts.push(products[i]);
          console.warn(`상품 정보 가져오기 실패: ${products[i].product_id}`, res.message);
        }
      }
      
      const cloths = Array.from(clothsMap.values());
      if (cloths.length === 0) {
        console.error('모든 상품 정보 가져오기 실패');
        return;
      }
      
      // 일부만 성공한 경우 사용자에게 알림
      if (failedProducts.length > 0) {
        console.warn(`${failedProducts.length}개 상품 정보를 가져오지 못했습니다.`);
      }

      const newCodination = addNewCodination(cloths);

      // 중복 코디네이션 방지: 동일 조합이 이미 저장되어 있으면 추가하지 않음
      const isDuplicate = codinations.some((existing) => isSameCodination(existing, newCodination));
      if (isDuplicate) {
        alert('이미 같은 코디네이션이 저장되어 있습니다.');
        return;
      }

      // IndexedDB에 저장하면서 코디네이션 추가
      await addCodination(newCodination);
      
      // 옷장에 아이템들 추가 (중복 제거)
      for (const cloth of cloths) {
        const exists = closet.some(existingCloth => existingCloth.id === cloth.id);
        if (!exists) {
          await addClothToCloset(cloth);
        }
      }
      
      setActiveCodination(newCodination);
      setPanel('codination');
      // 저장됨 표시를 위해 로컬 키 기록
      const key = makeProductsKey(products);
      setLocallySavedKeys((prev) => new Set(prev).add(key));
    },
    [codinations, addCodination, addNewCodination, setActiveCodination, setPanel, closet, addClothToCloset],
  );

  return (
    <div className="w-full">
      {/* 본문 + 댓글을 하나의 큰 카드 안에 배치 */}
      {isMainPost && (
        <div className="flex justify-start">
          <div className={'w-full sm:max-w-[90%] rounded-2xl overflow-hidden bg-white border border-blue'}>
            <div className="p-3 sm:p-6 space-y-4">
              {/* 본문 */}
              <div className="flex w-full min-w-0 flex-col space-y-4 overflow-hidden">
                <p className="flex space-x-3 text-lg">
                  <span className="font-extrabold">{message.user?.username || '사용자'}</span>
                  <span className="text-gray-500">{elapsedTimeText(message.createdAt)}</span>
                </p>
                <p className="text-xl whitespace-pre-line break-words">{message.content}</p>
                {message.products.length > 0 && (
                  <div className="w-full">
                    <div className="flex gap-2 overflow-x-auto">
                      {message.products.map((product, key) => (
                        <ClothModal key={key} product={product}>
                          <Image
                            width={400}
                            height={400}
                            src={product.product_url}
                            alt={product.product_id}
                            className="object-contain"
                            style={{ width: '64px', height: '64px' }}
                          />
                        </ClothModal>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 댓글 (같은 카드 내부, 콜랩스) */}
              {replies.length > 0 && (
                <div className="pt-3">
                  <button
                    onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 mb-3"
                  >
                    <LucideIcon name={isRepliesCollapsed ? 'ChevronRight' : 'ChevronDown'} className="w-4 h-4" />
                    <span>{replies.length}개의 AI 답변</span>
                  </button>
                  {!isRepliesCollapsed && (
                    <div className="space-y-3">
                      {replies.map((reply, index) => (
                        <div
                          key={index}
                          className={`flex items-start p-3 sm:p-4 space-x-3 rounded-xl border-0 shadow-none ${messageColor[1]}`}
                        >
                          <div className="w-12 h-12 flex-shrink-0 relative">
                            <Image
                              className="rounded-full"
                              src={
                                reply.agent?.agentname?.includes('스타일')
                                  ? '/ai/ai_style.webp'
                                  : reply.agent?.agentname?.includes('컬러')
                                    ? '/ai/ai_color.webp'
                                    : reply.agent?.agentname?.includes('코디네이터')
                                      ? '/ai/ai_codi.webp'
                                      : '/TFT_icon.png'
                              }
                              alt={'ai'}
                              fill
                            />
                          </div>
                          <div className="flex w-full min-w-0 flex-col space-y-3 overflow-hidden">
                            <p className="flex space-x-2 text-sm">
                              <span className="font-extrabold">{reply.agent?.agentname || 'AI'}</span>
                              <span className="text-gray-500">{elapsedTimeText(reply.createdAt)}</span>
                            </p>
                            <p className="text-lg whitespace-pre-line break-words">
                              <MessageParser text={reply.content} />
                            </p>
                            {reply.products.length > 0 && (
                              <div className="w-full">
                                <div className="flex gap-2 overflow-x-auto">
                                  {reply.products.map((product, key) => (
                                    <ClothModal key={key} product={product}>
                                      <Image
                                        width={400}
                                        height={400}
                                        src={product.product_url}
                                        alt={product.product_id}
                                        className="object-contain"
                                        style={{ width: '64px', height: '64px' }}
                                      />
                                    </ClothModal>
                                  ))}
                                </div>
                              </div>
                            )}
                            {reply.products.length > 0 &&
                              (() => {
                                const k = makeProductsKey(reply.products);
                                const isSaved = locallySavedKeys.has(k) || savedKeysFromStore.has(k);
                                return (
                                  <button
                                    className={
                                      `inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all self-start shadow-sm ` +
                                      (isSaved
                                        ? 'bg-blue text-white hover:bg-navy-600'
                                        : 'bg-white text-blue border border-blue hover:bg-blue/5')
                                    }
                                    onClick={() => addCodinationFromProducts(reply.products)}
                                    disabled={isSaved}
                                    title={isSaved ? '이미 저장됨' : '코디 저장하기'}
                                  >
                                    <LucideIcon
                                      name={'Heart'}
                                      color={isSaved ? 'blue-50' : 'blue-500'}
                                      {...(isSaved ? { fill: 'currentColor' } : {})}
                                    />
                                    <span>{isSaved ? '저장됨' : '코디 저장하기'}</span>
                                  </button>
                                );
                              })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 일반 메시지 (기존 로직 유지) */}
      {!isMainPost && replies.length === 0 && (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`flex items-start p-3 sm:p-6 ${isUser ? 'max-w-[70%]' : 'w-full sm:max-w-[70%]'} space-x-4 rounded-2xl overflow-hidden ${isUser ? 'border border-blue' : ''} ${isUser ? messageColor[0] : messageColor[1]}`}
          >
            {!isUser && (
              <div className="w-15 h-15 flex-shrink-0 relative">
                <Image className="rounded-full" src={agentThumbnail} alt={'ai style'} fill />
              </div>
            )}
            <div className="flex w-full min-w-0 flex-col space-y-4 overflow-hidden">
              <p className={`flex space-x-3 text-lg mb-3`}>
                <span className=" font-extrabold">
                  {message.user ? message.user.username : message.agent.agentname}
                </span>
                <span className="text-gray-500">{elapsedTimeText(message.createdAt)}</span>
              </p>
              <p className={`text-xl whitespace-pre-line break-words`}>
                {isUser ? message.content : <MessageParser text={message.content} />}
              </p>

              {message.products.length > 0 && (
                <div className="mt-4 w-full">
                  <div className="flex gap-2 overflow-x-auto">
                    {message.products.map((product, key) => (
                      <ClothModal key={key} product={product}>
                        <Image
                          width={400}
                          height={400}
                          src={product.product_url}
                          alt={product.product_id}
                          className="object-contain"
                          style={{ width: '64px', height: '64px' }}
                        />
                      </ClothModal>
                    ))}
                  </div>
                </div>
              )}
              {!isUser &&
                message.products.length > 0 &&
                (() => {
                  const k = makeProductsKey(message.products);
                  const isSaved = locallySavedKeys.has(k) || savedKeysFromStore.has(k);
                  return (
                    <button
                      className={
                        `mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all shadow-sm w-full sm:w-auto ` +
                        (isSaved
                          ? 'bg-blue text-white hover:bg-navy-600'
                          : 'bg-white text-blue border border-blue hover:bg-blue/5')
                      }
                      onClick={() => addCodinationFromProducts(message.products)}
                      disabled={isSaved}
                      title={isSaved ? '이미 저장됨' : '코디 저장하기'}
                    >
                      <LucideIcon
                        name={'Heart'}
                        color={isSaved ? 'blue-50' : 'blue-500'}
                        {...(isSaved ? { fill: 'currentColor' } : {})}
                      />
                      <span>{isSaved ? '저장됨' : '코디 저장하기'}</span>
                    </button>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
