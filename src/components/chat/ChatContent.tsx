import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';

export default function ChatContent() {
  return (
    <div className="w-full xl:w-1/2 h-full lg:transition-all lg:duration-300">
      <div className="flex flex-col w-full h-full">
        <div className="flex-1 min-h-0">
          <ChatArea />
        </div>
        <ChatInputBox />
      </div>
    </div>
  );
}
