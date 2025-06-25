'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import ChatHeader from '@/components/ChatHeader';
import ChatSubmit from '@/components/ChatSubmit';
import ChatArea from '@/components/ChatArea';
import { useChat } from '@/shared/hooks/useChat';

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const [currentChatId, setCurrentChatId] = useState('1');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const router = useRouter();

  /** chat */
  const { messages, isLoading, error } = useChat();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      user: { user_id: 'qwer', username: 'mendul' },
      timestamp: new Date(),
    };
    setInputValue('');
  };

  /** chat Channel */
  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full relative">
        <ChatHeader />
        <AppSidebar currentChatId={currentChatId} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
        <SidebarInset className="flex flex-col pt-16 md:pl-16 md:transition-all md:duration-300">
          <div className="flex-1">
            {isLoading && messages.length === 0 ? (
              <div>대화 내용을 불러오는 중...</div>
            ) : (
              <ChatArea messages={messages} />
            )}
            <ChatSubmit inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// setTimeout(() => {

//   const aiMessage: Message = {
//     id: (Date.now() + 1).toString(),
//     text: getAIResponse(inputValue),
//     user: { user_id: 'asdf', username: 'mindul' },
//     timestamp: new Date(),
//     images: inputValue.includes('추천') ? [`/cloth1.jpg`, `/cloth2.jpg`] : undefined,
//   };
//   setMessages((prev) => [...prev, aiMessage]);

//   // 새로운 사진이 추천되면 photos 배열에 추가
//   if (aiMessage.images) {
//     const newPhotos = aiMessage.images.map((url, index) => ({
//       id: `new-${Date.now()}-${index}`,
//       url,
//       description: `추천 아이템 ${index + 1}`,
//       tags: ['추천', '패션'],
//     }));
//     setPhotos((prev) => [...prev, ...newPhotos]);
//   }
// }, 1000);
