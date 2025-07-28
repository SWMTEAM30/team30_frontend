'use client';

import { isSidebarOpenAtom } from '@/atoms/chatAtoms';
import SidebarContent from '@/components/chat/SidebarContent';
import { useAtom } from 'jotai';
import { Menu } from 'lucide-react';

export function ChatSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  return (
    <aside
      className={`h-screen bg-beige transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-80' : 'w-32'} overflow-x-hidden`}
    >
      <div className="flex items-center w-full h-20">
        <button
          type="button"
          className="p-6 cursor-pointer flex items-center justify-center"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu className="w-8 h-8 text-blue" />
        </button>
      </div>
      <SidebarContent className={`w-full ${isSidebarOpen ? '' : 'sidebar-collapsed'}`} />
    </aside>
  );
}
