export default function ReplyTypingPlaceholder() {
  return (
    <div className="ml-8 border-l-2 border-gray-200 pl-4">
      <div className="flex justify-start">
        <div className={
          'flex items-start p-3 sm:p-4 w-full sm:max-w-[85%] space-x-3 rounded-xl overflow-hidden bg-white/80 backdrop-blur border border-gray-200 shadow-sm'
        }>
          <div className="w-12 h-12 flex-shrink-0 relative rounded-full bg-gray-200 animate-pulse" />
          <div className="flex w-full min-w-0 flex-col space-y-3">
            <p className="text-sm text-gray-500">AI 전문가가 답변을 작성하는 중입니다…</p>
            <div className="space-y-2">
              <div className="h-3 w-11/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-9/12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-7/12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


