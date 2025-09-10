import ChatContent from '@/components/chat/ChatContent';
import ChatPanel from '@/components/chat/ChatPanel';

export default function Chat() {
  return (
    <div className="flex">
      <div className="flex min-h-screen w-1/2">
        <ChatContent />
      </div>
      <div className="w-1/2">
        <ChatPanel />
      </div>
    </div>
  );
}
