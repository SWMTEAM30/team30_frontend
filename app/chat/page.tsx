import { ChatSidebar } from '@/components/chat/sidebar/ChatSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInputBox from '@/components/chat/message/ChatInputBox';
import ChatArea from '@/components/chat/message/ChatArea';
import ChatContextProvider from '@/components/chat/ChatContextProvider';
import ChatSidePanel from '@/components/chat/cloth/ChatSidePanel';

export default function Chat() {
  return (
    <ChatContextProvider>
      <div className="flex">
        <div className="flex min-h-screen w-1/2">
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
        </div>
        <div className="w-1/2">
          <ChatSidePanel />
        </div>
      </div>
    </ChatContextProvider>
  );
}
