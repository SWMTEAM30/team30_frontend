import ChatContentHeader from '@/components/chat/ChatContentHeader';
import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';

export default function ChatContent() {
  return (
    <>
      {/* <div className="hidden lg:block">
        <ChatSidebar />
      </div> */}
      <div className="w-full h-[100dvh] lg:transition-all lg:duration-300">
        <div className="flex flex-col w-full h-full">
          <ChatContentHeader />
          <div className="flex-1 min-h-0">
            <ChatArea />
          </div>
          <ChatInputBox />
        </div>
      </div>
    </>
  );
}
