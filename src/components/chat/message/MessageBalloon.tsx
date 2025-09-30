import MessageParser from '@/components/chat/message/MessageParser';
import ClothModal from '@/components/chat/modal/ClothModal';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { elapsedTimeText } from '@/lib/utils';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';
import { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { activeCodinationAtom, codinationsAtom, panelAtom } from '@/atoms/chatAtoms';
import { useCodination } from '@/hooks/useCodination';
import { getChatProduct } from '@/api/chatAPI';

export default function MessageBalloon({ message }: { message: Message }) {
  const isUserId = !!message.user;
  let agentThumbnail = '/model_image.jpg';
  if (message.agent?.agentname) {
    if (message.agent.agentname.includes('스타일')) agentThumbnail = '/ai/ai_style.webp';
    if (message.agent.agentname.includes('컬러')) agentThumbnail = '/ai/ai_color.webp';
    if (message.agent.agentname.includes('코디네이터')) agentThumbnail = '/ai/ai_codi.webp';
  }

  const setPanel = useSetAtom(panelAtom);
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const setActiveCodination = useSetAtom(activeCodinationAtom);
  const { addNewCodination } = useCodination();

  const addCodination = useCallback(async () => {
    if (isUserId) return;
    if (!message.products || message.products.length === 0) return;

    const results = await Promise.all(message.products.map((p) => getChatProduct(p)));
    const clothsMap = new Map<string, ClosetCloth>();
    for (const res of results) {
      if (res.status === 'success' && res.data) {
        const cloth = res.data as ClosetCloth;
        clothsMap.set(cloth.id, cloth);
      }
    }
    const cloths = Array.from(clothsMap.values());
    if (cloths.length === 0) return;

    const newCodination = addNewCodination(cloths);
    setCodinations((prev) => [...prev, newCodination]);
    setActiveCodination(newCodination);
    setPanel('codination');
  }, [isUserId, message.products, setCodinations, addNewCodination, setActiveCodination, setPanel]);

  return (
    <div className={`flex ${isUserId ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-start p-3 sm:p-6 ${isUserId ? 'max-w-[70%]' : 'w-full sm:max-w-[70%]'} space-x-4 rounded-2xl overflow-hidden ${isUserId ? messageColor[0] : messageColor[1]}`}
      >
        {!isUserId && (
          <div className="w-15 h-15 flex-shrink-0 relative">
            <Image className="rounded-full" src={agentThumbnail} alt={'ai style'} fill />
          </div>
        )}
        <div className="flex w-full min-w-0 flex-col space-y-4 overflow-hidden">
          <p className={`flex space-x-3 text-lg mb-3`}>
            <span className=" font-extrabold">{message.user ? message.user.username : message.agent.agentname}</span>
            <span className="text-gray-500">{elapsedTimeText(message.createdAt)}</span>
          </p>
          <p className={`text-xl whitespace-pre-line break-words`}>
            {isUserId ? message.content : <MessageParser text={message.content} />}
          </p>

          {message.products.length > 0 && (
            <div className="mt-4 w-full">
              <div className="flex gap-2 overflow-x-auto">
                {message.products.map((product, key) => (
                  <ClothModal key={key} product={product}>
                    <Image
                      width={256}
                      height={256}
                      src={product.product_url}
                      alt={product.product_id}
                      className="w-128 h-128 object-contain"
                    />
                  </ClothModal>
                ))}
              </div>
            </div>
          )}
          {!isUserId && message.products.length > 0 && (
            <button
              className="mt-4 flex justify-center space-x-2 rounded rounded- border border-blue w-full p-3"
              onClick={() => addCodination()}
            >
              <LucideIcon name={'Heart'} />
              <span>코디 저장하기 </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
