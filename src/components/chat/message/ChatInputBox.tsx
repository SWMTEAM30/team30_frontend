'use client';

import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useRef } from 'react';
import Image from 'next/image';
import { useAtom, useAtomValue } from 'jotai';
import { inputValueAtom, inputProductAtom, isAIRespondingAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/components/chat/ChatContextProvider';

export default function ChatInputBox() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const inputProduct = useAtomValue(inputProductAtom);
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const { handleSendMessage, handleFileChange } = useChatHandlers();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => fileInputRef.current?.click();

  return (
    <div
      className="
    shrink-0
    flex flex-col items-end gap-2 w-full max-w-7xl mx-auto 
    bg-white dark:bg-blue-800 
    rounded-2xl border border-blue-500 dark:border-blue-800 
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-800
    transition-all duration-200
    p-2
  "
    >
      <div className="flex space-x-5 items-start">
        {inputProduct && <Image src={inputProduct.product_url} alt={''} width={100} height={100} />}
      </div>
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="패션에 대해 마음대로 물어보세요!"
        onKeyDown={(event) => {
          if (event.key == 'Enter' && !event.shiftKey && inputValue.trim() != '' && !isAIResponding) {
            event.preventDefault();
            handleSendMessage();
          }
        }}
        className="
      flex-1 bg-transparent resize-none
      min-h-[48px] max-h-[80px]
      text-3xl
      px-5 py-3
      border-none focus-visible:border-0 focus:outline-none focus:ring-0
      dark:text-white
    "
        rows={1}
        disabled={isAIResponding.length > 0}
      />
      <div className="flex space-x-5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={isAIResponding.length > 0}
        />
        <Button
          onClick={handleButtonClick}
          className="
      flex-shrink-0
      flex items-center justify-center
      w-16 h-16 rounded-full
      bg-blue-500 text-white 
      hover:bg-blue-600
      disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:cursor-not-allowed
      transition-all duration-200
      mb-1
    "
          disabled={isAIResponding.length > 0}
        >
          <Plus />
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={inputValue.trim() === '' || isAIResponding.length > 0}
          className="
      flex-shrink-0 
      flex items-center justify-center
      w-16 h-16 rounded-full
      bg-blue-500 text-white 
      hover:bg-blue-600
      disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:cursor-not-allowed
      transition-all duration-200
      mb-1
    "
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
