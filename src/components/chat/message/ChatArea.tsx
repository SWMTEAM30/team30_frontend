'use client';

import { getChatRoomsRoomIdMessages } from '@/api/chatAPI';
import { messagesAtomFamily, roomIdAtom, streamingMessageAtom, isAIRespondingAtom } from '@/atoms/chatAtoms';
import EmptyChatStart from '@/components/chat/message/EmptyChatStart';
import MessageBalloon from '@/components/chat/message/MessageBalloon';
import MessageGroup from '@/components/chat/message/MessageGroup';
import { groupMessagesIntoPosts, addMessageToGroups, MessageGroup as MessageGroupType } from '@/lib/messageGrouping';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatArea() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const streamingMessage = useAtomValue(streamingMessageAtom);
  const roomId = useAtomValue(roomIdAtom);
  const [messages, setMessages] = useAtom(messagesAtomFamily(roomId));
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const prevStreamingSizeRef = useRef(0);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [canLoadOlder, setCanLoadOlder] = useState(true);
  const [messageGroups, setMessageGroups] = useState<MessageGroupType[]>([]);

  // 단일 로더: beforeDate 유무에 따라 초기/이전 메시지 로드
  const loadMessages = useCallback(
    async (beforeDate?: Date) => {
      if (!roomId) return;
      const hasOlderFetch = !!beforeDate;
      if (hasOlderFetch) {
        if (isFetchingOlder || !canLoadOlder) return;
        setIsFetchingOlder(true);
      }
      try {
        const response = await getChatRoomsRoomIdMessages(roomId, beforeDate);
        if (response.status === 'success' && response.data?.messages) {
          const fetched = response.data.messages;
          setMessages((prev) => {
            const newMessages = [...fetched, ...prev];
            // 메시지 그룹 업데이트
            setMessageGroups(groupMessagesIntoPosts(newMessages));
            return newMessages;
          });
          if (fetched.length === 0) setCanLoadOlder(false);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsFetchingOlder(false);
      }
    },
    [roomId, isFetchingOlder, canLoadOlder, setMessages],
  );

  // 첫 마운트 시에 대화 내용 불러오기
  useEffect(() => {
    loadMessages();
  }, [roomId]);

  // 메시지가 변경될 때마다 그룹 업데이트
  useEffect(() => {
    if (messages.length > 0) {
      setMessageGroups(groupMessagesIntoPosts(messages));
    }
  }, [messages]);

  // 스크롤 감지 이벤트
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      // 스크롤이 맨 위에 가까이 있을 때
      if (scrollArea.scrollTop <= 50 && !isFetchingOlder && canLoadOlder) {
        const oldest = messages[0];
        if (oldest?.createdAt) loadMessages(oldest.createdAt);
      }
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [messages, loadMessages, isFetchingOlder, canLoadOlder]);

  // 스트리밍 메시지가 0에서 새로 생긴 상황에서 자동 스크롤
  useEffect(() => {
    const currentSize = streamingMessage.size;
    const prevSize = prevStreamingSizeRef.current;

    // 이전에 0이었고 현재 0보다 클 때만 스크롤
    if (prevSize === 0 && currentSize > 0 && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    prevStreamingSizeRef.current = currentSize;
  }, [streamingMessage]);

  // 사용자 메시지 전송 시 메시지가 추가될 때 스크롤
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  // 채팅방이 비어있고 로딩 중이 아닐 때 시작 화면 표시
  if (!roomId || messages.length + streamingMessage.size === 0) {
    return <EmptyChatStart />;
  }

  return (
    <div className={`flex flex-col transition-all duration-500 ease-in-out flex-1`}>
      <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto chat-scroll">
        <div className="space-y-6 mx-auto">
          {/* 이전 메시지 로딩 인디케이터 */}
          {isFetchingOlder && (
            <div className="flex justify-center py-4">
              <div className="text-gray-500">이전 메시지를 불러오는 중...</div>
            </div>
          )}
          <>
            {messageGroups.length > 0 ? (
              <>
                {messageGroups.slice(0, -1).map((group, i) => (
                  <MessageGroup key={group.id} group={group} showDivider={i > 0} />
                ))}

                {(() => {
                  const last = messageGroups[messageGroups.length - 1];
                  const streamingReplies = [...streamingMessage].map(([_, msg]) => msg);
                  const typingPlaceholder =
                    isAIResponding && streamingMessage.size === 0
                      ? [
                          {
                            id: `typing-${Date.now()}`,
                            content: 'AI 전문가가 답변을 작성하는 중입니다…',
                            createdAt: new Date(),
                            products: [],
                            agent: { agentname: 'AI' } as any,
                          } as unknown as Message,
                        ]
                      : [];
                  const hasStreaming = streamingReplies.length > 0;
                  const augmentedLast = {
                    ...last,
                    replies: [...last.replies, ...streamingReplies, ...typingPlaceholder],
                  };
                  return (
                    <MessageGroup key={augmentedLast.id} group={augmentedLast} showDivider={messageGroups.length > 1} />
                  );
                })()}
              </>
            ) : (
              // 그룹이 아직 없는데 스트리밍만 진행되는 예외 상황 대비
              [...streamingMessage].map(([agent, content]) => <MessageBalloon key={agent} message={content} />)
            )}
          </>
        </div>
      </div>
    </div>
  );
}
