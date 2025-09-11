import { userAtom } from '@/atoms/authAtoms';
import { messagesAtom } from '@/atoms/chatAtoms';
import { tmpUserId, tmpUsername } from '@/queries/useUser';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

// 1. 훅에 전달할 콜백 함수들의 타입을 명확하게 정의합니다.
interface ChatStreamCallbacks {
  onConnect?: (data: any) => void;
  onContent?: (data: any) => void;
  onComplete?: (data: any) => void; // complete 이벤트도 콜백으로 처리 가능
}

interface StreamParams {
  userInput: string;
  callbacks: ChatStreamCallbacks; // 2. 범용 onData 대신 콜백 객체를 받습니다.
}

const streamChat = ({ userInput, callbacks }: StreamParams) => {
  return new Promise((resolve, reject) => {
    const url = `/api/chat/rooms/125/messages/stream?user_input=${encodeURIComponent(userInput)}`;
    const eventSource = new EventSource(url);

    // 3. 각 이벤트 리스너가 type 분기 없이, 해당하는 콜백을 직접 호출합니다.
    eventSource.addEventListener('connect', (event) => {
      const parsedData = JSON.parse(event.data);
      callbacks.onConnect?.(parsedData.data);
    });

    eventSource.addEventListener('content', (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.status === 'success') {
        callbacks.onContent?.(parsedData.data);
      }
    });

    eventSource.addEventListener('complete', (event) => {
      const finalData = JSON.parse(event.data);
      if (finalData.status === 'success') {
        callbacks.onComplete?.(finalData.data);
        resolve(finalData.data);
      } else {
        reject(new Error(finalData.message || 'Stream completed with an error.'));
      }
      eventSource.close();
    });

    eventSource.addEventListener('error', (error) => {
      console.error('EventSource failed:', error);
      reject(new Error('Failed to connect to the event stream.'));
      eventSource.close();
    });
  });
};

export const useChatStream = () => {
  const user = useAtomValue(userAtom);
  const setMessages = useSetAtom(messagesAtom);
  const sendMessage = async (inputValue: string, products?: Product) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      user: { userId: user?.userId || tmpUserId, username: user?.username || tmpUsername },
      agent: null,
      message_type: 'USER',
      products: products ? [products] : [],
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  return {
    sendMessage,
    streamChat,
  };
};
