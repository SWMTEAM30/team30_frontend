import { ScrollArea } from '@/components/ui/scroll-area';
import { messageColor } from '@/styles/chat';

export default function ChatArea({
  userID,
  messages,
  isLoading,
}: {
  userID: string;
  messages: Message[];
  isLoading: boolean;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-4">
      <div className="space-y-4 max-w-[1024px] mx-auto">
        {isLoading ? (
          <div>대화 내용을 불러오는 중...</div>
        ) : (
          <>
            {messages.map((message, i) => (
              <div key={i} className={`flex ${message.user.userId == userID ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-6 rounded-lg ${message.user.userId == 'asdf' ? messageColor[0] : messageColor[1]}`}
                >
                  <p className="text-lg md:text-2xl">{message.text}</p>
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
