import { getChatProduct } from '@/api/chatAPI';
import { useChatHandlers } from '@/components/chat/area/ChatContextProvider';
import MessageParser from '@/components/chat/area/MessageParser';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';

export default function MessageBalloon({ message }: { message: Message }) {
  const { handleOpenTab } = useChatHandlers();
  const isUserId = !!message.user;

  const handleOpenImageTab = async (product: Product) => {
    const data = await getChatProduct(product);
    if (data.status == 'fail') return;
    handleOpenTab(data.data, 'image');
  };

  return (
    <div className={`flex ${isUserId ? 'justify-end' : 'justify-start'}`}>
      {!isUserId && (
        <div className="w-12 h-12 m-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          AI
        </div>
      )}
      <div className={`max-w-[70%] p-6 rounded-2xl ${isUserId ? messageColor[0] : messageColor[1]}`}>
        <p className="text-lg md:text-xl font-serif font-extrabold mb-3">
          {message.user ? message.user.username : message.agent.agentname}
        </p>
        <p className="text-lg md:text-2xl font-serif">
          {isUserId ? message.content : <MessageParser text={message.content} />}
        </p>
        <p className="text-xs opacity-70 mt-2">{message.createdAt.toLocaleTimeString()}</p>
        {/* AI 메시지에만 사진 첨부 */}
        {!isUserId && (
          <div className="mt-4 flex flex-row gap-2 overflow-x-hidden">
            {message.products &&
              message.products
                .filter((product) => !!product.product_url)
                .map((product, key) => (
                  <Image
                    key={key}
                    width={300}
                    height={400}
                    src={product.product_url}
                    alt={product.product_id}
                    className="w-72 h-90 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
                    onClick={() => handleOpenImageTab(product)}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
