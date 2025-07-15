import SidebarContent from '@/components/SidebarContent';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface AppSidebarProps {
  chatRooms: ChatRoom[];
  currentChatId: number | null;
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
}

export function AppSidebar({ chatRooms, currentChatId, onChatSelect, onNewChat }: AppSidebarProps) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <aside
      className={`h-screen bg-beige transition-all duration-300 ease-in-out shadow-lg flex flex-col
        ${openSidebar ? 'w-80' : 'w-32'}
        overflow-x-hidden
      `}
    >
      {/* 햄버거 아이콘을 완전히 가운데 정렬, 클릭 시 사이드바 토글 */}
      <div className="flex items-center w-full h-20">
        <button
          type="button"
          className="p-6 cursor-pointer flex items-center justify-center"
          onClick={() => setOpenSidebar((prev) => !prev)}
        >
          <Menu className="w-8 h-8 text-blue" />
        </button>
      </div>
      <SidebarContent
        chatRooms={chatRooms}
        currentChatId={currentChatId}
        onChatSelect={onChatSelect}
        onNewChat={onNewChat}
        className={`w-full ${openSidebar ? '' : 'sidebar-collapsed'}`}
        isSidebarOpen={openSidebar}
      />
    </aside>
  );
}
