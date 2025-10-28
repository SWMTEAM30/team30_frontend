import { useState } from 'react';
import LucideIcon from '@/components/ui/icons/LucideIcon';
import { elapsedTimeText } from '@/lib/utils';
import ReplyList from './ReplyList';
import ProductGallery from './ProductGallery';

interface MainPostProps {
  message: Message;
  replies: Message[];
  onSaveCodination: (products: any[], sourceMessage?: Message) => Promise<void>;
  isSaved: (products: any[]) => boolean;
}

export default function MainPost({ message, replies, onSaveCodination, isSaved }: MainPostProps) {
  const [isRepliesCollapsed, setIsRepliesCollapsed] = useState(false);

  return (
    <div className="flex justify-start">
      <div
        className={
          'w-full sm:max-w-[90%] rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-blue dark:border-slate-600'
        }
      >
        <div className="p-6 space-y-4">
          {/* 본문 */}
          <div className="flex w-full min-w-0 flex-col space-y-4 overflow-hidden">
            <p className="flex space-x-3 text-lg">
              <span className="font-extrabold">{message.user?.username || '사용자'}</span>
              <span className="text-gray-500">{elapsedTimeText(message.createdAt)}</span>
            </p>
            <p className="text-xl whitespace-pre-line break-words">{message.content}</p>

            {message.products.length > 0 && <ProductGallery products={message.products} />}
          </div>

          {/* 댓글 */}
          {replies.length > 0 && (
            <div className="pt-3 ">
              <button
                onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)}
                className="flex items-center space-x-2 text-md mb-3 "
              >
                <LucideIcon
                  name={isRepliesCollapsed ? 'ChevronRight' : 'ChevronDown'}
                  color="blue-300"
                  className="w-4 h-4"
                />
                <span>{replies.length}개의 AI 답변</span>
              </button>

              {!isRepliesCollapsed && (
                <ReplyList replies={replies} onSaveCodination={onSaveCodination} isSaved={isSaved} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
