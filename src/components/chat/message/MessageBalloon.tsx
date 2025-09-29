import MessageParser from '@/components/chat/message/MessageParser';
import ClothModal from '@/components/chat/modal/ClothModal';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';

export default function MessageBalloon({ message }: { message: Message }) {
  const isUserId = !!message.user;

  return (
    <div className={`flex ${isUserId ? 'justify-end' : 'justify-start'}`}>
      {!isUserId && (
        <div className="w-12 h-12 m-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          AI
        </div>
      )}
      <div className={`max-w-[70%] p-6 rounded-2xl ${isUserId ? messageColor[0] : messageColor[1]}`}>
        <p className="text-lg md:text-xl font-extrabold mb-3">
          {message.user ? message.user.username : message.agent.agentname}
        </p>
        <p className="text-lg md:text-2xl whitespace-pre-line">
          {isUserId ? message.content : <MessageParser text={message.content} />}
        </p>
        {/* <p className="text-xs opacity-70 mt-2">{message.createdAt.toLocaleTimeString()}</p> */}
        {
          <div className="mt-4 flex flex-row gap-2 overflow-x-auto overflow-y-hidden">
            {message.products &&
              message.products.map((product, key) => (
                <ClothModal key={key} product={product}>
                  <Image
                    width={300}
                    height={400}
                    src={product.product_url}
                    alt={product.product_id}
                    className="w-72 h-90 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
                  />
                </ClothModal>
              ))}
          </div>
        }
      </div>
    </div>
  );
}
