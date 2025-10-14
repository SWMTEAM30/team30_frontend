export interface MessageGroup {
  id: string;
  mainPost: Message;
  replies: Message[];
  timestamp: Date;
  isNewSession?: boolean;
}

/**
 * 기존 메시지 배열을 본 글과 댓글 구조로 그룹화합니다.
 * @param messages 메시지 배열
 * @returns 그룹화된 메시지 배열
 */
export function groupMessagesIntoPosts(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  // 1) 메시지 중복 제거 (id 기준, 최초 등장 순서 유지)
  const seenIds = new Set<string | number>();
  const deduped: Message[] = [];
  for (const m of messages) {
    const key = m.id as unknown as string; // id는 백엔드 스키마에 따름
    if (!seenIds.has(key)) {
      seenIds.add(key);
      deduped.push(m);
    }
  }

  // 2) 동일 사용자 메시지가 여러 번 본 글로 등장할 수 있으므로 고유 그룹 id 보장
  const groupIdCounter = new Map<string | number, number>();

  for (let i = 0; i < deduped.length; i++) {
    const message = deduped[i];
    const isUserMessage = !!message.user;
    const isFirstMessage = i === 0;
    const prevMessage = i > 0 ? deduped[i - 1] : null;

    // 새로운 사용자 메시지가 시작되거나 첫 번째 메시지인 경우
    if (isUserMessage && (isFirstMessage || !prevMessage?.user)) {
      // 이전 그룹이 있다면 저장
      if (currentGroup) {
        groups.push(currentGroup);
      }

      // 새로운 그룹 시작
      const count = (groupIdCounter.get(message.id) || 0) + 1;
      groupIdCounter.set(message.id, count);
      currentGroup = {
        id: `group-${message.id}-${count}`,
        mainPost: message,
        replies: [],
        timestamp: message.createdAt,
        isNewSession: isFirstMessage,
      };
    }
    // AI 메시지인 경우 (댓글)
    else if (!isUserMessage && currentGroup) {
      currentGroup.replies.push(message);
    }
    // 사용자 메시지이지만 이전 메시지도 사용자 메시지인 경우 (새로운 그룹)
    else if (isUserMessage && prevMessage?.user) {
      // 이전 그룹 저장
      if (currentGroup) {
        groups.push(currentGroup);
      }

      // 새로운 그룹 시작
      const count = (groupIdCounter.get(message.id) || 0) + 1;
      groupIdCounter.set(message.id, count);
      currentGroup = {
        id: `group-${message.id}-${count}`,
        mainPost: message,
        replies: [],
        timestamp: message.createdAt,
        isNewSession: false,
      };
    }
  }

  // 마지막 그룹 저장
  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * SSE로 받은 새로운 메시지를 기존 그룹에 추가하거나 새 그룹을 생성합니다.
 * @param existingGroups 기존 메시지 그룹들
 * @param newMessage 새로운 메시지
 * @returns 업데이트된 메시지 그룹들
 */
export function addMessageToGroups(existingGroups: MessageGroup[], newMessage: Message): MessageGroup[] {
  const isUserMessage = !!newMessage.user;
  const lastGroup = existingGroups[existingGroups.length - 1];

  // 사용자 메시지인 경우 새 그룹 생성
  if (isUserMessage) {
    // 동일 message.id로 여러 그룹이 생길 수 있으므로 suffix로 충돌 방지
    const sameIdCount = existingGroups.filter((g) => g.mainPost.id === newMessage.id).length + 1;
    const newGroup: MessageGroup = {
      id: `group-${newMessage.id}-${sameIdCount}`,
      mainPost: newMessage,
      replies: [],
      timestamp: newMessage.createdAt,
      isNewSession: false,
    };
    return [...existingGroups, newGroup];
  }

  // AI 메시지인 경우 마지막 그룹에 댓글 추가
  if (lastGroup && !isUserMessage) {
    const updatedGroups = [...existingGroups];
    updatedGroups[updatedGroups.length - 1] = {
      ...lastGroup,
      replies: [...lastGroup.replies, newMessage],
    };
    return updatedGroups;
  }

  // 예외 상황: AI 메시지인데 그룹이 없는 경우
  // 임시로 사용자 메시지로 처리하여 새 그룹 생성
  const fallbackIndex = existingGroups.length + 1;
  const fallbackGroup: MessageGroup = {
    id: `group-${newMessage.id}-${fallbackIndex}`,
    mainPost: {
      ...newMessage,
      user: { username: '시스템' } as any, // 임시 사용자 정보
    },
    replies: [],
    timestamp: newMessage.createdAt,
    isNewSession: false,
  };
  return [...existingGroups, fallbackGroup];
}
