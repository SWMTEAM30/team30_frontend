import { MessageSquare, Plus, Settings, Menu } from 'lucide-react';

interface AppSidebarProps {
  chatRooms: ChatRoom[];
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
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
        className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-200 hidden peer-checked:block md:hidden"
      />
      {/* 모바일 사이드바 */}
      <aside className="fixed top-0 left-0 h-full w-80 max-w-full z-50 bg-beige shadow-lg transform transition-transform duration-300 -translate-x-full peer-checked:translate-x-0 md:hidden">
        <div className="flex flex-col items-start py-6 h-full">
          <button onClick={onNewChat} className="flex items-center w-full px-4 mb-4 h-12 rounded-lg bg-blue text-white">
            <Plus className="w-5 h-5" />
            <span className="ml-3 font-medium whitespace-nowrap">새 채팅</span>
          </button>
          <div className="flex-1 flex flex-col gap-2 w-full">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onChatSelect(room.id)}
                className={`flex items-center w-full px-4 h-12 rounded-lg transition-all duration-200 ${
                  currentChatId === room.id ? 'bg-blue text-white' : 'hover:bg-blue-300 text-blue'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="ml-3 font-medium whitespace-nowrap">{room.title}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center w-full px-4 h-12 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 mt-auto mb-2">
            <Settings className="w-5 h-5" />
            <span className="ml-3 font-medium whitespace-nowrap">설정</span>
          </button>
        </div>
      </aside>

      {/* 데스크탑: 호버 오버레이 */}
      <aside className="hidden md:block group fixed top-0 left-0 h-screen z-50 bg-beige transition-all duration-300 ease-in-out shadow-lg group-hover:shadow-2xl w-16 hover:w-80 group-hover:w-80 overflow-x-hidden">
        <div className="flex flex-col items-start py-4 h-full w-full">
          {/* 새 채팅 버튼 */}
          <button
            onClick={onNewChat}
            className="flex items-center w-full px-2 mb-4 h-12 rounded-lg transition-all duration-200 bg-blue text-white group-hover:pl-4 group-hover:pr-4 pl-4 pr-4"
          >
            <Plus className="w-5 h-5" />
            <span className="ml-3 font-medium whitespace-nowrap hidden group-hover:inline">새 채팅</span>
          </button>
          {/* 채팅방 버튼들 */}
          <div className="flex-1 flex flex-col gap-2 w-full">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onChatSelect(room.id)}
                className={`flex items-center w-full px-2 h-12 rounded-lg transition-all duration-200
                  ${currentChatId === room.id ? 'bg-blue text-white' : 'hover:bg-blue-300 text-blue'}
                  group-hover:pl-4 group-hover:pr-4 pl-4 pr-4
                `}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="ml-3 font-medium whitespace-nowrap hidden group-hover:inline">{room.title}</span>
              </button>
            ))}
          </div>
          {/* 설정 버튼 */}
          <button className="flex items-center w-full px-2 h-12 rounded-lg transition-all duration-200 mt-auto mb-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 group-hover:pl-4 group-hover:pr-4 pl-4 pr-4">
            <Settings className="w-5 h-5" />
            <span className="ml-3 font-medium whitespace-nowrap hidden group-hover:inline">설정</span>
          </button>
        </div>
      </aside>
    </>
  );
}
