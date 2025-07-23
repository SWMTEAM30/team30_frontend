import { userAtom } from '@/atoms/authAtoms';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';
import { tmpUserId } from '@/queries/useUser';
import { messageColor } from '@/styles/chat';
import { useAtomValue } from 'jotai';
import Image from 'next/image';

export default function MessageBalloon({ message }: { message: Message }) {
  const { handleOpenTab } = useChatHandlers();
  const user = useAtomValue(userAtom);
  const isUserId = () => message.user.userId === (user?.userId || tmpUserId);

  return (
    <div className={`flex ${isUserId() ? 'justify-end' : 'justify-start'}`}>
      {!isUserId() && (
        <div className="w-12 h-12 m-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          AI
        </div>
      )}
      <div className={`max-w-[70%] p-6 rounded-2xl ${isUserId() ? messageColor[0] : messageColor[1]}`}>
        <p className="text-lg md:text-xl font-serif font-extrabold mb-3">{message.user.username}</p>
        <p className="text-lg md:text-2xl font-serif">{message.text}</p>
        <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
        {/* AI 메시지에만 사진 첨부 */}
        {!isUserId() && (
          <div className="mt-4 flex flex-row gap-2 overflow-x-auto">
            {message.images &&
              message.images.map((image, key) => (
                <Image
                  key={key}
                  width={300}
                  height={400}
                  src={image.src}
                  alt={image.name}
                  className="w-72 h-90 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
                  onClick={() => handleOpenTab(image, 'image')}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
