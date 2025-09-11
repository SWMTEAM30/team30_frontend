import { isAIRespondingAtom } from '@/atoms/chatAtoms';
import { messageColor } from '@/styles/chat';
import { useAtomValue } from 'jotai';

// AI 응답 준비 중 스피너 컴포넌트
export default function AILoadingSpinner() {
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const agentnameParser = () => {
    if (isAIResponding == 'style') return '스타일 분석가';
    if (isAIResponding == 'trend') return '트랜드 전문가';
    if (isAIResponding == 'color') return '컬러 전문가';
    if (isAIResponding == 'codi') return '핏팅 코디네이터';
  };

  return (
    <>
      {/* 첫 번째 AI 스피너 */}

      <div className="flex justify-start">
        <div className="w-12 h-12 m-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          AI
        </div>
        <div className={`max-w-[70%] p-6 rounded-lg ${messageColor[1]}`}>
          <p className="text-lg md:text-xl font-serif font-extrabold mb-3">{agentnameParser()}</p>
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
