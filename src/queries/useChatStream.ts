import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { inputProductAtom, inputValueAtom, messagesAtom, streamingMessageAtom } from '../atoms/chatAtoms';
import { tmpUserId, tmpUsername } from '@/queries/useUser';
import { userAtom } from '@/atoms/authAtoms';
import { useSearchParams } from 'next/navigation';

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
  onError: (error: Event) => void;
}) => {
  const queryParams = new URLSearchParams({
    user_input: inputValue,
    // ...(userProfile && { user_profile: userProfile }),
  });

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}/api/chat/rooms/${roomId}/messages/stream?${queryParams}`,
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
  const [streamingMessage, setStreamingMessage] = useAtom(streamingMessageAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setInputValue = useSetAtom(inputValueAtom);
  const setInputProduct = useSetAtom(inputProductAtom);
  const user = useAtomValue(userAtom);

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
        startChatStream({
          roomId,
          inputValue,
          products,
          onConnect: (data: ConnectResponse) => {
            console.log(data);
          },
          onContent: (data: ContentResponse) => {
            console.log(data.message);
            //console.log(streamingMessage);
            setStreamingMessage((prev: Map<string, Message>) => {
              const next = prev;
              let newMessage = next.get(data.agent_id);
              if (!newMessage)
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
              next.set(data.agent_id, { ...newMessage, content: newMessage.content + data.message });
              console.log(newMessage.content + data.message);
              return next;
            });
          },
          onComplete: (data: any) => {
            console.log(data);
            resolve(data);
          },
          onError: (error: any) => {
            console.error('SSE Error:', error);
            reject(error);
          },
        });
      });
    },
    onMutate: ({ inputValue, products }: { inputValue: string; products?: Product }) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        user: { userId: user?.userId || tmpUserId, username: user?.username || tmpUsername },
        agent: null,
        message_type: 'USER',
        products: products ? [products] : [],
        createdAt: new Date(),
      };
      setInputValue('');
      setInputProduct(undefined);
      setMessages((prev) => [...prev, userMessage]);
      setStreamingMessage(new Map());
    },
    onSettled: () => {
      //setMessages((prev)=>[...prev, ])
      console.log('채팅 끝');
    },
  });

  return mutation;
};
