# 채팅내역 병합 기능 사용법

## 개요

`useChatMessage` 훅에 기존 채팅내역을 현재 채팅방에 추가하는 기능이 구현되었습니다. 이 기능을 통해 다른 채팅방의 메시지나 외부에서 가져온 메시지를 현재 채팅방에 병합할 수 있습니다.

## 주요 기능

### 1. `addExistingMessages(existingMessages: Message[])`

기존 메시지 배열을 현재 채팅방에 추가하는 함수입니다.

**특징:**
- 중복 메시지 자동 제거 (id 기준)
- timestamp 기준으로 자동 정렬
- 기존 메시지와 새 메시지를 병합

**사용 예시:**
```typescript
import { useChatMessage } from '@/queries/useChatMessage';

const { addExistingMessages } = useChatMessage();

const existingMessages: Message[] = [
  {
    id: 'msg-1',
    text: '안녕하세요!',
    user: { userId: 'user1', username: '사용자1' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'msg-2',
    text: '반갑습니다!',
    user: { userId: 'user2', username: '사용자2' },
    timestamp: new Date('2024-01-01T10:01:00Z'),
  },
];

// 현재 채팅방에 메시지 추가
addExistingMessages(existingMessages);
```

### 2. `addMessagesFromChatRoom(sourceChatId: number)`

특정 채팅방의 모든 메시지를 현재 채팅방에 추가하는 함수입니다.

**특징:**
- 다른 채팅방의 메시지를 현재 채팅방으로 복사
- 중복 메시지 자동 제거
- 자동 정렬

**사용 예시:**
```typescript
import { useChatMessage } from '@/queries/useChatMessage';

const { addMessagesFromChatRoom } = useChatMessage();

// 채팅방 ID 123의 메시지를 현재 채팅방에 추가
addMessagesFromChatRoom(123);
```

## ChatMessageMerger 컴포넌트 사용법

`ChatMessageMerger` 컴포넌트는 채팅내역 병합 기능을 쉽게 사용할 수 있는 UI를 제공합니다.

```typescript
import { ChatMessageMerger } from '@/components/chat/ChatMessageMerger';

// 컴포넌트에서 사용
<ChatMessageMerger currentChatId={currentChatId} />
```

### 제공하는 기능:

1. **예시 메시지 추가**: 미리 정의된 예시 메시지를 현재 채팅방에 추가
2. **다른 채팅방에서 가져오기**: 특정 채팅방 ID를 입력하여 해당 채팅방의 메시지를 가져오기
3. **커스텀 메시지 추가**: JSON 형식으로 메시지를 직접 입력하여 추가

## Message 타입

```typescript
type Message = {
  id: string;           // 메시지 고유 ID
  text: string;         // 메시지 내용
  user: User;           // 사용자 정보
  timestamp: Date;      // 메시지 시간
  images?: PanelData[]; // 이미지 (선택사항)
};
```

## 주의사항

1. **중복 제거**: 같은 id를 가진 메시지는 자동으로 제거됩니다.
2. **정렬**: timestamp 기준으로 자동 정렬됩니다.
3. **채팅방 선택**: 채팅방이 선택되지 않은 상태에서는 기능이 비활성화됩니다.
4. **데이터 무결성**: 잘못된 형식의 JSON이나 메시지 데이터는 처리되지 않습니다.

## 실제 사용 시나리오

### 시나리오 1: 이전 대화 내용 복원
```typescript
// 사용자가 이전에 나눈 대화를 현재 채팅방에 복원하고 싶을 때
const previousMessages = getStoredMessages(userId);
addExistingMessages(previousMessages);
```

### 시나리오 2: 다른 채팅방의 유용한 대화 가져오기
```typescript
// 다른 채팅방에서 유용한 패션 조언을 현재 채팅방에 가져오고 싶을 때
addMessagesFromChatRoom(usefulChatRoomId);
```

### 시나리오 3: 외부 데이터 통합
```typescript
// 외부 API나 파일에서 가져온 메시지를 현재 채팅방에 추가
const externalMessages = await fetchExternalMessages();
addExistingMessages(externalMessages);
```

## 에러 처리

- 잘못된 JSON 형식: 사용자에게 알림 표시
- 존재하지 않는 채팅방: 조용히 무시
- 네트워크 오류: 기존 에러 처리 방식 따름

이 기능을 통해 채팅 애플리케이션에서 더욱 유연하고 강력한 메시지 관리가 가능합니다. 