import ExampleSuggestions from '@/components/chat/message/ExampleSuggestion';
import Image from 'next/image';

export default function EmptyChatStart() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full text-center px-4">
      {/* 로고 */}
      <div className="mb-8">
        <Image src="/TFT_icon.png" alt="The First Take" width={96} height={96} className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">The First Take</h1>
        <p className="text-lg ">패션 AI 어시스턴트</p>
      </div>

      {/* 시작 문구 */}
      <div className="mb-8 max-w-md">
        <p className="text-xl  mb-4">패션에 대해 무엇이든 물어보세요!</p>
        <p className="">스타일링 조언부터 특별한 날의 코디까지, AI가 도와드릴게요.</p>
      </div>

      {/* 예시 선택지 */}
      <ExampleSuggestions />
    </div>
  );
}
