import { Menu } from 'lucide-react';
import SidebarContent from '@/components/SidebarContent';
import { useAtom, useAtomValue } from 'jotai';
import { activePanelTypeAtom, currentChatIdAtom } from '@/atoms/chatAtoms';

interface AppSidebarProps {
  chatRooms: ChatRoom[];
  onChatSelect: (chatId: number) => void;
  onNewChat: () => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}

export default function ChatHeader({ chatRooms, onChatSelect, onNewChat, setIsSidebarOpen }: AppSidebarProps) {
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  return (
    <div className="flex items-center justify-between px-4 py-6 mx-16 md:mx-auto w-[calc(100vw-68px)] lg:w-full bg-white">
      <div className="flex items-center gap-2">
        {/* 모바일: 햄버거 버튼 */}
        <button className="fixed top-4 left-4 z-50 lg:hidden p-2 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6 text-blue" />
        </button>
        {/* 모바일 오버레이 및 사이드바 */}
        {activePanelType != null && (
          <>
            <div
              className="fixed inset-0 z-[500] bg-black opacity-40 transition-opacity duration-200 lg:hidden"
              onClick={() => setActivePanelType(null)}
            />
            <aside className="fixed top-0 left-0 h-full w-[80%] max-w-full z-[500] bg-beige shadow-lg transform transition-transform duration-300 lg:hidden">
              <div className="flex items-center w-full h-20">
                <button
                  type="button"
                  className="p-6 cursor-pointer flex items-center justify-center"
                  onClick={() => setActivePanelType(null)}
                >
                  <Menu className="w-8 h-8 text-blue" />
                </button>
              </div>
              <SidebarContent
                chatRooms={chatRooms}
                currentChatId={currentChatId}
                onChatSelect={onChatSelect}
                onNewChat={onNewChat}
                className="py-6"
              />
            </aside>
          </>
        )}
        <span className="font-bold text-3xl text-blue">The First Take {currentChatId?.toString() || ''}</span>
      </div>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
        U
      </div>
    </div>
  );
}
