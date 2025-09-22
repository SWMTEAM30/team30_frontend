import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import {
  inputProductAtom,
  inputValueAtom,
  messagesAtomFamily,
  roomIdAtom,
  streamingMessageAtom,
} from '../atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';
import { useRef } from 'react';

interface ConnectResponse {
  message: string;
  type: 'connect';
  timestamp: any;
}

interface ContentResponse {
  agent_id: string;
  agent_name: string;
  message: string;
  type: 'content';
  timestamp: any;
}

interface CompleteResponse {
  agent_id: string;
  agent_name: string;
  message: string;
  products: Product[];
  timestamp: any;
}

const startChatStream = ({
  roomId,
  inputValue,
  products,
  onConnect,
  onContent,
  onComplete,
  onError,
}: {
  roomId: string | null;
  inputValue: string;
  products?: Product;
  onConnect: (data: ConnectResponse) => void;
  onContent: (data: ContentResponse) => void;
  onComplete: (data: CompleteResponse) => void;
  onError: (error: any) => void;
}) => {
  const queryParams = new URLSearchParams({
    user_input: inputValue,
    room_id: roomId ?? '',
    // ...(userProfile && { user_profile: userProfile }),
  });

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}/api/chat/rooms/messages/stream?${queryParams}`,
  );
  eventSource.addEventListener('connect', (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.status === 'success') {
      onConnect(parsedData.data);
    }
  });

  eventSource.addEventListener('content', (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.status === 'success') {
      if (parsedData?.data?.message?.includes('Claude API 스트리밍 호출 실패')) {
        onError(new Error('Claude API 스트리밍 호출 실패'));
        eventSource.close();
        return;
      }
      onContent(parsedData.data);
    }
  });

  eventSource.addEventListener('complete', (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.status === 'success') {
      onComplete(parsedData.data);
    }
    eventSource.close();
  });

  eventSource.addEventListener('error', (error) => {
    onError(error);
    eventSource.close();
  });

  return eventSource;
};

export const useChatStream = () => {
  const roomId = useAtomValue(roomIdAtom);
  const setMessages = useSetAtom(messagesAtomFamily(roomId));
  const [streamingMessage, setStreamingMessage] = useAtom(streamingMessageAtom);
  const setInputValue = useSetAtom(inputValueAtom);
  const setInputProduct = useSetAtom(inputProductAtom);
  const user = useAtomValue(userAtom);

  const eventSourceRef = useRef<EventSource | null>(null);
  const completedAgentsRef = useRef<Set<string>>(new Set());

  const mutation = useMutation({
    mutationFn: ({
      roomId,
      inputValue,
      products,
    }: {
      roomId: string | null;
      inputValue: string;
      products?: Product;
    }) => {
      return new Promise((resolve, reject) => {
        const eventSource = startChatStream({
          roomId,
          inputValue,
          products,
          onConnect: (data: ConnectResponse) => {
            console.log('SSE Connected:', data);
          },
          onContent: (data: ContentResponse) => {
            console.log('SSE content', data);
            setStreamingMessage((prev) => {
              const next = new Map(prev);
              let newMessage = next.get(data.agent_id);

              if (!newMessage) {
                newMessage = {
                  id: Date.now().toString(),
                  content: '',
                  user: null,
                  agent: {
                    agentname: data.agent_name,
                    agentType: data.agent_id,
                  },
                  message_type: 'AGENT',
                  products: [],
                  createdAt: new Date(),
                };
              }
              next.set(data.agent_id, {
                ...newMessage,
                content: newMessage.content + data.message,
              });
              return next;
            });
          },
          onComplete: (data: any) => {
            console.log('SSE Complete:', data);
            const completedMessage = {
              id: Date.now().toString(),
              content: data.message,
              user: null,
              agent: {
                agentname: data.agent_name,
                agentType: data.agent_id,
              },
              message_type: 'AGENT',
              products: data.products || [],
              createdAt: new Date(),
            };

            setMessages((prev) => [...prev, completedMessage]);
            completedAgentsRef.current.add(data.agent_id);

            setStreamingMessage((prev) => {
              const next = new Map(prev);
              next.delete(data.agent_id);
              return new Map(next);
            });

            eventSourceRef.current = null;
            resolve(data);
          },
          onError: (error: ErrorEvent) => {
            console.error('SSE Error:', error);

            const completedMessage = {
              id: Date.now().toString(),
              content: 'SSE 처리 중 에러가 발생했습니다: ' + error.message,
              user: null,
              agent: {
                agentname: '에러 감지기',
                agentType: 'error detector',
              },
              message_type: 'AGENT',
              products: [],
              createdAt: new Date(),
            };

            setMessages((prev) => [...prev, completedMessage]);
            eventSourceRef.current = null;
            reject(error);
          },
        });
        eventSourceRef.current = eventSource;
      });
    },
    onMutate: ({ inputValue, products }: { inputValue: string; products?: Product }) => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (user === null) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        user: user,
        agent: null,
        message_type: 'USER',
        products: products ? [products] : [],
        createdAt: new Date(),
      };
      setInputValue('');
      setInputProduct(undefined);
      setMessages((prev) => [...prev, userMessage]);
      setStreamingMessage(new Map());
      completedAgentsRef.current.clear();
    },
    onSettled: () => {
      setMessages((prevMessages) => {
        const finalStreamingMessages = Array.from(streamingMessage.values()).filter(
          (message) => !completedAgentsRef.current.has(message.agent?.agentType || ''),
        );
        return [...prevMessages, ...finalStreamingMessages];
      });
      setStreamingMessage(new Map());
    },
  });

  return mutation;
};
