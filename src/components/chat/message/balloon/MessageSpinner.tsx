import React from 'react';

export default function MessageSpinner() {
  return (
    <div className="max-w-[70%] p-6 rounded-2xl border border-blue text-blue-500">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-lg md:text-2xl font-serif">AI 전문가가 답변을 작성하는 중입니다...</p>
      </div>
    </div>
  );
}
