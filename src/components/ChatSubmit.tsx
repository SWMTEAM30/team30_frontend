import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function ChatSubmit({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: any;
  setInputValue: any;
  handleSendMessage: any;
}) {
  return (
    <div
      // 1. 부모 컨테이너를 Flexbox로 만듭니다.
      className="
              shrink-0
    flex flex-col items-end gap-2 w-full max-w-[1024px] mx-auto 
    bg-white dark:bg-blue-800 
    rounded-2xl border border-blue-500 dark:border-blue-800 
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-800
    transition-all duration-200
    p-2
  "
    >
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="패션에 대해 마음대로 물어보세요!"
        className="
      flex-1 bg-transparent resize-none
      min-h-[48px] max-h-[80px]
      text-3xl
      px-5 py-3
      border-none focus-visible:border-0 focus:outline-none focus:ring-0
      dark:text-white
    "
        rows={1}
      />
      <Button
        onClick={handleSendMessage}
        disabled={inputValue.trim() === ''}
        className="
      flex-shrink-0 /* 3. 버튼은 공간이 부족해도 찌그러지지 않습니다. */
      flex items-center justify-center
      w-16 h-16 rounded-full
      bg-blue-500 text-white 
      hover:bg-blue-600
      disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:cursor-not-allowed
      transition-all duration-200
      mb-1 /* 세로 정렬 미세 조정 */
    "
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
