import { useState } from 'react';
import { MessageSquare, Plus, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

interface AppSidebarProps {
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function AppSidebar({ currentChatId, onChatSelect, onNewChat }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: '패션 추천 채팅',
      lastMessage: '안녕하세요! 패션 아이템 추천을 도와드릴게요.',
      timestamp: new Date(),
    },
  ]);

  // 모바일: 상단바의 햄버거 버튼 클릭 시만 Sheet 오픈 (오른쪽에서 나옴)
  if (isMobile) {
    if (typeof window !== 'undefined') {
      const trigger = document.getElementById('mobile-sidebar-trigger');
      if (trigger && !trigger.onclick) {
        trigger.onclick = () => setMobileOpen(true);
      }
    }
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-80 max-w-full pt-16">
          <div className="flex flex-col items-start py-6 h-full">
            <button
              onClick={onNewChat}
              className="flex items-center w-full px-4 mb-4 h-12 rounded-lg bg-[#4993FA] text-white"
            >
              <Plus className="w-5 h-5" />
              <span className="ml-3 font-medium whitespace-nowrap">새 채팅</span>
            </button>
            <div className="flex-1 flex flex-col gap-2 w-full">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onChatSelect(chat.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center w-full px-4 h-12 rounded-lg transition-all duration-200 ${currentChatId === chat.id ? 'bg-[#4993FA] text-white' : 'hover:bg-[#F1FAFB] text-[#4993FA]'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="ml-3 font-medium whitespace-nowrap">{chat.title}</span>
                </button>
              ))}
            </div>
            <button className="flex items-center w-full px-4 h-12 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 mt-auto mb-2">
              <Settings className="w-5 h-5" />
              <span className="ml-3 font-medium whitespace-nowrap">설정</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // 데스크탑: 왼쪽에 오버레이 사이드바, 호버 시 오버레이
  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out shadow-lg bg-white
        ${isExpanded ? 'w-80' : 'w-16'}
        flex flex-col items-start py-4
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ pointerEvents: 'auto' }}
    >
      {/* + 새 채팅 버튼 */}
      <button
        onClick={onNewChat}
        className={`flex items-center w-full px-2 mb-4 h-12 rounded-lg transition-all duration-200
          bg-[#4993FA] text-white ${isExpanded ? 'pl-4 pr-4' : 'pl-4 pr-4'}
        `}
      >
        <Plus className="w-5 h-5" />
        {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">새 채팅</span>}
      </button>

      {/* 채팅방 버튼들 */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`flex items-center w-full px-2 h-12 rounded-lg transition-all duration-200
              ${currentChatId === chat.id ? 'bg-[#4993FA] text-white' : 'hover:bg-[#F1FAFB] text-[#4993FA]'}
              ${isExpanded ? 'pl-4 pr-4' : 'pl-4 pr-4'}
            `}
          >
            <MessageSquare className="w-5 h-5" />
            {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">{chat.title}</span>}
          </button>
        ))}
      </div>

      {/* 설정 버튼 */}
      <button
        className={`flex items-center w-full px-2 h-12 rounded-lg transition-all duration-200 mt-auto mb-2
          text-gray-600 hover:text-gray-800 hover:bg-gray-100
          ${isExpanded ? 'pl-4 pr-4' : 'pl-4 pr-4'}
        `}
      >
        <Settings className="w-5 h-5" />
        {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">설정</span>}
      </button>
    </div>
  );
}
