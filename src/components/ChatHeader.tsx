import { Menu } from 'lucide-react';
import SidebarContent from '@/components/SidebarContent';

interface AppSidebarProps {
  chatRooms: ChatRoom[];
  currentChatId: number | null;
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
}

export default function ChatHeader({ chatRooms, currentChatId, onChatSelect, onNewChat }: AppSidebarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-6 mx-16 md:mx-auto w-[calc(100vw-68px)] lg:w-full bg-white">
      <div className="flex items-center gap-2">
        {/* 모바일: 햄버거 버튼 + 체크박스 해킹 */}
        <input type="checkbox" id="sidebar-mobile-toggle" className="hidden peer" />
        <label htmlFor="sidebar-mobile-toggle" className="fixed top-4 left-4 z-50 lg:hidden p-2 cursor-pointer">
          <Menu className="w-6 h-6 text-blue" />
        </label>
        {/* 모바일 오버레이 */}
        <label
          htmlFor="sidebar-mobile-toggle"
          className="fixed inset-0 z-40 bg-black opacity-40 transition-opacity duration-200 hidden peer-checked:block lg:hidden"
        />
        {/* 모바일 사이드바 */}
        <aside className="fixed top-0 left-0 h-full w-[80%] max-w-full z-50 bg-beige shadow-lg transform transition-transform duration-300 -translate-x-full peer-checked:translate-x-0 lg:hidden">
          <SidebarContent
            chatRooms={chatRooms}
            currentChatId={currentChatId}
            onChatSelect={onChatSelect}
            onNewChat={onNewChat}
            className="py-6"
          />
        </aside>
        <span className="font-bold text-3xl text-blue">The First Take {currentChatId?.toString() || ''}</span>
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
        U
      </div>
    </div>
  );
}
