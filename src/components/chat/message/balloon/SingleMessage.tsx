import Image from 'next/image';
import MessageParser from '@/components/chat/message/balloon/MessageParser';
import { elapsedTimeText } from '@/lib/utils';
import { messageColor } from '@/styles/chat';
import ProductGallery from './ProductGallery';
import SaveCodinationButton from './SaveCodinationButton';

interface SingleMessageProps {
  message: Message;
  isUser: boolean;
  onSaveCodination: (products: any[], sourceMessage?: Message) => Promise<void>;
  isSaved: (products: any[]) => boolean;
}

export default function SingleMessage({ message, isUser, onSaveCodination, isSaved }: SingleMessageProps) {
  let agentThumbnail = '/model_image.jpg';
  if (message.agent?.agentname) {
    if (message.agent.agentname.includes('스타일')) agentThumbnail = '/ai/ai_style.webp';
    if (message.agent.agentname.includes('컬러')) agentThumbnail = '/ai/ai_color.webp';
    if (message.agent.agentname.includes('코디네이터')) agentThumbnail = '/ai/ai_codi.webp';
  }

  return (
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
            <span className=" font-extrabold">{message.user ? message.user.username : message.agent.agentname}</span>
            <span className="text-gray-500">{elapsedTimeText(message.createdAt)}</span>
          </p>

          <p className={`text-xl whitespace-pre-line break-words`}>
            {isUser ? message.content : <MessageParser text={message.content} />}
          </p>

          {message.products.length > 0 && <ProductGallery products={message.products} />}

          {!isUser && message.products.length > 0 && (
            <SaveCodinationButton
              products={message.products}
              sourceMessage={message}
              onSaveCodination={onSaveCodination}
              isSaved={isSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
