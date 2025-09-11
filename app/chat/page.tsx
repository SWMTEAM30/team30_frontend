import ChatContent from '@/components/chat/ChatContent';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatPanel from '@/components/chat/ChatPanel';

export default function Chat() {
  return (
    <div className="flex flex-col">
      <ChatHeader />
      <div className="flex h-[calc(100vh-5rem)]">
        <ChatContent />
        <ChatPanel />
      </div>
    </div>
  );
}
