import Image from 'next/image';
import MessageParser from '@/components/chat/message/balloon/MessageParser';
import { elapsedTimeText } from '@/lib/utils';
import { messageColor } from '@/styles/chat';
import ProductGallery from './ProductGallery';
import SaveCodinationButton from './SaveCodinationButton';

interface ReplyListProps {
  replies: Message[];
  onSaveCodination: (products: any[], sourceMessage?: Message) => Promise<void>;
  isSaved: (products: any[]) => boolean;
}

export default function ReplyList({ replies, onSaveCodination, isSaved }: ReplyListProps) {
  return (
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

          <div className="flex w-full min-w-0 flex-col space-y-3 overflow-hidden dark:text-blue-300">
            <p className="flex space-x-2 text-sm">
              <span className="font-extrabold">{reply.agent?.agentname || 'AI'}</span>
              <span className="text-gray-500">{elapsedTimeText(reply.createdAt)}</span>
            </p>

            <p className="text-lg  whitespace-pre-line break-words">
              <MessageParser text={reply.content} />
            </p>

            {reply.products.length > 0 && <ProductGallery products={reply.products} />}
            {reply.products.length > 0 && (
              <SaveCodinationButton
                products={reply.products}
                sourceMessage={reply}
                onSaveCodination={onSaveCodination}
                isSaved={isSaved}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
