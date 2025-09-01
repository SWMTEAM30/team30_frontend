import ChatContent from '@/components/chat/ChatContent';
import ChatPanel from '@/components/chat/ChatPanel';

export default function Chat() {
  return (
    <div className="flex">
      <div className="flex min-h-screen w-2/5">
        <ChatContent />
      </div>
      <div className="w-3/5">
        <ChatPanel />
      </div>
    </div>
  );
}
