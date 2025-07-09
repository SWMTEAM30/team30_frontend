export default // AI 응답 준비 중 스피너 컴포넌트
function AILoadingSpinner() {
  return (
    <>
      {/* 첫 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
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

      {/* 두 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.1s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.3s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 세 번째 AI 스피너 */}
      <div className="flex justify-start">
        <div className="max-w-[70%] p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.6s', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
