import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInputBox from '@/components/chat/ChatInputBox';
import ChatArea from '@/components/chat/ChatArea';
import ChatContextProvider from '@/components/chat/ChatContextProvider';
import ChatSidePanel from '@/components/chat/ChatSidePanel';

export default function Chat() {
  return (
    <ChatContextProvider>
      <div className="flex min-h-screen w-full relative">
        <div className="hidden lg:block">
          <ChatSidebar />
        </div>
        <SidebarInset className="flex flex-col h-[100dvh] lg:transition-all lg:duration-300">
          <div className="flex flex-col h-full">
            <ChatHeader />
            <div className="flex-1 min-h-0">
              <ChatArea />
            </div>
            <ChatInputBox />
          </div>
        </SidebarInset>
        <ChatSidePanel />
      </div>
    </ChatContextProvider>
  );
}
