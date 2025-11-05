import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import {
  globalEventSourceAtom,
  inputProductAtom,
  inputValueAtom,
  isAIRespondingAtom,
  messagesAtomFamily,
  roomIdAtom,
  streamingMessageAtom,
} from '../atoms/chatAtoms';
import { userAtom } from '@/atoms/authAtoms';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getStringNumbersOnly } from '@/lib/utils';

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

interface FinalCompleteResponse {
  total_experts: number;
  message: string;
  type: 'final_complete';
  timestamp: any;
}

const startChatStream = ({
  roomId,
  inputValue,
  products,
  onConnect,
  onContent,
  onComplete,
  onFinalComplete,
  onError,
}: {
  roomId: string | null;
  inputValue: string;
  products?: Product;
  onConnect: (data: ConnectResponse) => void;
  onContent: (data: ContentResponse) => void;
  onComplete: (data: CompleteResponse) => void;
  onFinalComplete: (data: FinalCompleteResponse) => void;
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

  eventSource.addEventListener('content', async (event) => {
    const parsedData = JSON.parse(event.data);
    console.log(parsedData);
    if (parsedData.status === 'success') {
      if (parsedData?.data?.message?.includes('Claude API 스트리밍 호출 실패')) {
        onError(new Error(parsedData.data.message));
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
  });

  eventSource.addEventListener('final_complete', (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.status === 'success') {
      onFinalComplete(parsedData.data);
    }
    eventSource.close();
  });

  eventSource.addEventListener('error', (error) => {
    onError(error);
    eventSource.close();
  });

  return eventSource;
};

// SSE 재연결을 관리하는 래퍼
const startChatStreamWithReconnect = ({
  roomId,
  inputValue,
  products,
  onConnect,
  onContent,
  onComplete,
  onFinalComplete,
  onError,
  setGlobalEventSource,
}: {
  roomId: string | null;
  inputValue: string;
  products?: Product;
  onConnect: (data: ConnectResponse) => void;
  onContent: (data: ContentResponse) => void;
  onComplete: (data: CompleteResponse) => void;
  onFinalComplete: (data: FinalCompleteResponse) => void;
  onError: (error: any) => void;
  setGlobalEventSource: (es: EventSource | null) => void;
}) => {
  let currentES: EventSource | null = null;
  let reconnectAttempt = 0;
  let closedManually = false;

  const maxDelay = 30000; // 30s cap
  const baseDelay = 1000; // 1s

  const connect = () => {
    if (closedManually) return;
    try {
      currentES = startChatStream({
        roomId,
        inputValue,
        products,
        onConnect: (d) => {
          reconnectAttempt = 0; // 성공 시 초기화
          onConnect(d);
        },
        onContent,
        onComplete,
        onFinalComplete: (d) => {
          onFinalComplete(d);
          // 서버에서 명시적 종료 -> 수동 종료 처리
          cleanup();
        },
        onError: (e) => {
          onError(e);
          scheduleReconnect();
        },
      });
      setGlobalEventSource(currentES);
    } catch (e) {
      onError(e);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (closedManually) return;
    reconnectAttempt += 1;
    const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempt - 1), maxDelay);
    // 페이지가 백그라운드면 가시성 다시 돌아올 때까지 대기
    if (typeof document !== 'undefined' && document.hidden) return;
    setTimeout(() => {
      cleanup(false);
      connect();
    }, delay);
  };

  const handleVisibility = () => {
    if (typeof document === 'undefined') return;
    if (!document.hidden && !currentES) {
      // 포그라운드 복귀 시 재연결
      scheduleReconnect();
    } else if (document.hidden) {
      // 백그라운드 전환 시 연결 정리
      cleanup(false);
    }
  };

  const cleanup = (manual = true) => {
    if (manual) closedManually = true;
    if (currentES && typeof currentES.close === 'function') {
      currentES.close();
    }
    currentES = null;
    setGlobalEventSource(null);
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility);
  }

  connect();

  return {
    close: () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
      cleanup(true);
    },
  };
};

export const useChatStream = () => {
  const roomId = useAtomValue(roomIdAtom);
  const setInputValue = useSetAtom(inputValueAtom);
  const setInputProduct = useSetAtom(inputProductAtom);
  const setIsAIResponding = useSetAtom(isAIRespondingAtom);
  const [streamingMessage, setStreamingMessage] = useAtom(streamingMessageAtom);
  const [globalEventSource, setGlobalEventSource] = useAtom(globalEventSourceAtom);
  const user = useAtomValue(userAtom);

  const pathname = usePathname();
  const setMessages = useSetAtom(messagesAtomFamily(roomId));
  const completedAgentsRef = useRef<Set<string>>(new Set());

  const mutation = useMutation({
    mutationFn: ({ inputValue, products }: { inputValue: string; products?: Product }) => {
      return new Promise((resolve, reject) => {
        if (!roomId) {
          reject(new Error('roomId is required'));
          return;
        }

        // 현재 페이지가 /chat 가 아닐 경우 SSE 시작하지 않음
        if (!pathname || !pathname.startsWith('/chat')) {
          console.log('useChatStream - not in /chat page, skip SSE');
          resolve({});
          return;
        }

        // 사용자 메시지 추가
        const userMessage: Message = {
          id: Date.now().toString(),
          content: inputValue,
          user: { userId: 'asdf', username: 'mindul', modelImage: null },
          agent: null,
          message_type: 'USER',
          products: products ? [products] : [],
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const controller = startChatStreamWithReconnect({
          roomId,
          inputValue,
          products,
          onConnect: (data: ConnectResponse) => {
            console.log('SSE Connected:', data);
            setIsAIResponding(true);
          },
          onContent: (data: ContentResponse) => {
            console.log('SSE Content:', data);
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
            const products: Product[] = data.products.map((product: Product) => {
              return {
                product_id: getStringNumbersOnly(product.product_id),
                product_url: product.product_url,
              };
            });

            const completedMessage = {
              id: Date.now().toString(),
              content: data.message,
              user: null,
              agent: {
                agentname: data.agent_name,
                agentType: data.agent_id,
              },
              message_type: 'AGENT',
              products: products || [],
              createdAt: new Date(),
            };
            setMessages((prev) => [...prev, completedMessage]);
            completedAgentsRef.current.add(data.agent_id);

            setStreamingMessage((prev) => {
              const next = new Map(prev);
              next.delete(data.agent_id);
              return new Map(next);
            });
          },
          onFinalComplete: (data: FinalCompleteResponse) => {
            console.log('SSE Final Complete:', data);
            setIsAIResponding(false);
            setGlobalEventSource(null);
            resolve(data);
          },
          onError: (error: ErrorEvent) => {
            console.error('SSE Error for roomId:', error);

            const completedMessage = {
              id: Date.now().toString(),
              content: 'SSE 처리 중 에러가 발생했습니다.\n' + error.message,
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
            setIsAIResponding(false);
            setGlobalEventSource(null);
            reject(error);
          },
          setGlobalEventSource,
        });
        // 기존 API와 호환되도록 EventSource 유사 객체를 저장하고, onMutate에서 close 호출되게 유지
        // @ts-ignore
        setGlobalEventSource({ close: () => controller.close() } as any);
      });
    },
    onMutate: () => {
      if (globalEventSource && typeof globalEventSource.close === 'function') {
        globalEventSource.close();
        setGlobalEventSource(null);
      }

      setInputValue('');
      setInputProduct(undefined);
      setStreamingMessage(new Map());
      completedAgentsRef.current.clear();
      setIsAIResponding(false);
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
