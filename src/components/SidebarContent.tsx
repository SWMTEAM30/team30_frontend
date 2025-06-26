import { cn } from '@/lib/utils';
import { Plus, MessageSquare, Settings } from 'lucide-react';

export default function SidebarContent({
  chatRooms,
  currentChatId,
  onChatSelect,
  onNewChat,
  className = '',
}: {
  chatRooms: ChatRoom[];
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col space-y-4 p-4 items-start h-full', className)}>
      <button
        onClick={onNewChat}
        className="flex items-center w-full p-4 h-12 rounded-lg hover:bg-yellow-200 text-blue"
      >
        <Plus className="w-5 h-5" />
        <span className="ml-3 font-medium whitespace-nowrap block md:hidden">새 채팅</span>
        <span className="ml-3 font-medium whitespace-nowrap hidden group-hover:inline">새 채팅</span>
      </button>
      <div className="flex-1 flex flex-col gap-2 w-full">
        {chatRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onChatSelect(room.id)}
            className={`flex items-center w-full px-4 h-12 rounded-lg transition-all duration-200 ${
              currentChatId === room.id ? 'bg-yellow-300 text-blue' : 'hover:bg-yellow-200 text-blue'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="ml-3 font-medium whitespace-nowrap block md:hidden">{room.title}</span>
            <span className="ml-3 font-medium whitespace-nowrap hidden group-hover:inline">{room.title}</span>
          </button>
        ))}
      </div>
      <button className="flex items-center w-full px-4 h-12 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 mt-auto mb-2">
        <Settings className="w-5 h-5" />
        <span className="ml-3 font-medium whitespace-nowrap">설정</span>
      </button>
    </div>
  );
}
