import { useMutation } from '@tanstack/react-query';

type EventName = 'room' | 'connect' | 'content' | 'complete';

/**
 * SSE 스트림을 설정하고, 받은 데이터를 콜백으로 전달하며,
 * 스트림이 끝나면 resolve되는 Promise를 반환하는 함수
 * @param {object} params
 * @param {string} params.userInput - 사용자가 입력한 메시지
 * @param {Function} params.onData - 'room', 'content' 등 각 이벤트를 전달받을 콜백 함수
 */
const streamChat = ({ userInput, onData }: { userInput: string; onData: Function }) => {
  return new Promise((resolve, reject) => {
    // 1. EventSource 인스턴스 생성
    const eventSource = new EventSource(`/api/chat/rooms/messages/stream?user_input=${encodeURIComponent(userInput)}`);

    // 2. 모든 이벤트를 처리할 공통 핸들러
    const handleEvent = (eventName: EventName, event: MessageEvent<EventName>) => {
      const parsedData = JSON.parse(event.data);
      // 'connect' 이벤트나 status가 'success'인 경우에만 콜백 실행
      if (parsedData.status === 'success' || ['connect', 'room'].includes(eventName)) {
        onData({
          type: eventName,
          payload: parsedData.data,
        });
      }
    };

    // 3. 명세에 따른 각 이벤트 리스너 등록
    eventSource.addEventListener('room', (event) => handleEvent('room', event));
    eventSource.addEventListener('connect', (event) => handleEvent('connect', event));
    eventSource.addEventListener('content', (event) => handleEvent('content', event));

    // 4. 'complete' 이벤트: 스트림 종료 및 Promise 완료
    eventSource.addEventListener('complete', (event) => {
      const finalData = JSON.parse(event.data);
      if (finalData.status === 'success') {
        handleEvent('complete', event);
        resolve(finalData.data); // Promise를 성공적으로 해결
      } else {
        reject(new Error(finalData.message || 'Stream completed with an error.'));
      }
      eventSource.close(); // 연결 종료
    });

    // 5. 'error' 이벤트: 에러 처리 및 Promise 거부
    eventSource.addEventListener('error', (error) => {
      console.error('EventSource failed:', error);
      reject(new Error('Failed to connect to the event stream.'));
      eventSource.close(); // 연결 종료
    });
  });
};

/**
 * 채팅 스트림을 위한 React Query useMutation 훅
 * @param {function} onData - 실시간 데이터를 처리할 콜백
 */
export const useChatStreamMutation = (onData: Function) => {
  return useMutation({
    mutationFn: (userInput: EventName) => streamChat({ userInput, onData }),
  });
};
