import SidebarContent from '@/components/chat/SidebarContent';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function ChatSidebar() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <aside
      className={`h-screen bg-beige transition-all duration-300 ease-in-out flex flex-col ${openSidebar ? 'w-80' : 'w-32'} overflow-x-hidden`}
    >
      <div className="flex items-center w-full h-20">
        <button
          type="button"
          className="p-6 cursor-pointer flex items-center justify-center"
          onClick={() => setOpenSidebar((prev) => !prev)}
        >
          <Menu className="w-8 h-8 text-blue" />
        </button>
      </div>
      <SidebarContent className={`w-full ${openSidebar ? '' : 'sidebar-collapsed'}`} />
    </aside>
  );
}
