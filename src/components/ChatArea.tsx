import { ScrollArea } from '@/components/ui/scroll-area';
import { messageColor } from '@/styles/chat';
import Image from 'next/image';

export default function ChatArea({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-4">
      <div className="space-y-4 max-w-[1024px] mx-auto">
        {isLoading ? (
          <div>대화 내용을 불러오는 중...</div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-6 rounded-lg ${messageColor[0]}`}>
                  <p className="text-lg md:text-2xl">{message.text}</p>
                  {message.images && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {message.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`추천 아이템 ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                          width={250}
                          height={250}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
