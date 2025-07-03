import SidebarContent from '@/components/SidebarContent';
import { Menu } from 'lucide-react';

interface AppSidebarProps {
  chatRooms: ChatRoom[];
  currentChatId: number;
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
}

export function AppSidebar({ chatRooms, currentChatId, onChatSelect, onNewChat }: AppSidebarProps) {
  return (
    <>
      {/* 모바일: 햄버거 버튼 + 체크박스 해킹 */}
      <input type="checkbox" id="sidebar-mobile-toggle" className="hidden peer" />
      <label
        htmlFor="sidebar-mobile-toggle"
        className="fixed top-4 left-4 z-50 md:hidden bg-beige rounded-full p-2 shadow-md cursor-pointer"
      >
        <Menu className="w-6 h-6 text-blue" />
      </label>
      {/* 모바일 오버레이 */}
      <label
        htmlFor="sidebar-mobile-toggle"
        className="fixed inset-0 z-40 bg-black opacity-40 transition-opacity duration-200 hidden peer-checked:block md:hidden"
      />
      {/* 모바일 사이드바 */}
      <aside className="fixed top-0 left-0 h-full w-[80%] max-w-full z-50 bg-beige shadow-lg transform transition-transform duration-300 -translate-x-full peer-checked:translate-x-0 md:hidden">
        <SidebarContent
          chatRooms={chatRooms}
          currentChatId={currentChatId}
          onChatSelect={onChatSelect}
          onNewChat={onNewChat}
          className="py-6"
        />
      </aside>
      {/* 데스크탑: 호버 오버레이 */}
      <aside className="hidden md:block group fixed top-0 left-0 h-screen z-50 bg-beige transition-all duration-300 ease-in-out shadow-lg group-hover:shadow-2xl w-32 hover:w-92 group-hover:w-80 overflow-x-hidden">
        <SidebarContent
          chatRooms={chatRooms}
          currentChatId={currentChatId}
          onChatSelect={onChatSelect}
          onNewChat={onNewChat}
          className="w-full"
        />
      </aside>
    </>
  );
}
