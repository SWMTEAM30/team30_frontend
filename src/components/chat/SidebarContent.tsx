import { activePanelTypeAtom, currentChatIdAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';
import { useChatRooms } from '@/queries/useChatRoom';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { Plus, MessageSquare, Settings } from 'lucide-react';

export default function SidebarContent({ className = '' }: { className?: string }) {
  const { handleNewChat, handleChatSelect } = useChatHandlers();
  const { rooms: chatRooms } = useChatRooms();
  const currentChatId = useAtomValue(currentChatIdAtom);
  const activePanelType = useAtomValue(activePanelTypeAtom);

  return (
    <div className={cn('flex flex-col space-y-4 p-4 items-start h-full', className)}>
      <button
        disabled={!currentChatId}
        onClick={handleNewChat}
        className={`flex items-center w-full p-4 h-12 rounded-lg hover:bg-yellow-200 text-blue disabled:text-gray-400 disabled:hover:bg-beige`}
      >
        <Plus className="w-5 h-5" />
        {!!activePanelType && <span className="ml-3 font-medium whitespace-nowrap">새 채팅</span>}
      </button>
      <div className="flex-1 flex flex-col gap-2 w-full">
        {chatRooms.map((room, i) => (
          <button
            key={i}
            onClick={() => handleChatSelect(room.id)}
            className={`flex items-center w-full px-4 h-12 rounded-lg transition-all duration-200 ${
              currentChatId === room.id ? 'bg-yellow-300 text-blue' : 'hover:bg-yellow-200 text-blue'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {!!activePanelType && <span className="ml-3 font-medium whitespace-nowrap">{room.title}</span>}
          </button>
        ))}
      </div>
      <button className="flex items-center w-full px-4 h-12 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 mt-auto mb-2">
        <Settings className="w-5 h-5" />
        {!!activePanelType && <span className="ml-3 font-medium whitespace-nowrap">설정</span>}
      </button>
    </div>
  );
}
