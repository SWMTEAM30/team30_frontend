'use client';

import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useCallback, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  inputValueAtom,
  inputProductAtom,
  isAIRespondingAtom,
  roomIdAtom,
  tempMessageAtom,
  userModelImageAtom,
} from '@/atoms/chatAtoms';
import { postChatUpload } from '@/api/chatAPI';
import { useChatStream } from '@/hooks/useChatStream';

export default function ChatInputBox() {
  const roomId = useAtomValue(roomIdAtom);
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [inputProduct, setInputProduct] = useAtom(inputProductAtom);
  const isAIResponding = useAtomValue(isAIRespondingAtom);
  const setUserModelImage = useSetAtom(userModelImageAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useChatStream();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(!roomId || isAIResponding);
  }, [roomId, isAIResponding]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files[0]);
        const response = await postChatUpload(formData);
        if (response.status === 'fail') {
          console.error(response.message);
          return;
        }
        const newMessageImage: Product = {
          product_url: response.data,
          product_id: 'user',
        };
        console.log(newMessageImage);
        setInputProduct(newMessageImage);
        setUserModelImage(response.data);
      }
    },
    [setInputProduct, setUserModelImage],
  );

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    mutate({ inputValue, products: inputProduct });
  }, [mutate, inputValue, inputProduct]);

  return (
    <div
      className="
    shrink-0
    flex flex-col items-end gap-2 w-full mx-auto 
    bg-white dark:bg-blue-800
    rounded-t-2xl border border-blue-500 dark:border-blue-800 
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
          if (event.key == 'Enter' && !event.shiftKey && inputValue.trim() != '') {
            event.preventDefault();
            handleSendMessage();
          }
        }}
        className="
        bg-white dark:bg-blue-800
          flex-1 resize-none
          min-h-[48px] max-h-[80px]
          text-3xl
          px-5 py-3
          border-none focus-visible:border-0 focus:outline-none focus:ring-0
        "
        rows={1}
        disabled={disabled}
      />
      <div className="flex space-x-5 bg-transparent">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={disabled}
        />
        <Button
          onClick={handleButtonClick}
          className="
      flex-shrink-0
      flex items-center justify-center
      w-16 h-16 rounded-full
      text-white dark:bg-blue-600
      hover:bg-blue-600 dark:hover:bg-blue-700
      disabled:bg-slate-300 disabled:dark:bg-slate-600 disabled:cursor-not-allowed
      transition-all duration-200
      mb-1
    "
          disabled={disabled}
        >
          <Plus />
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={inputValue.trim() === '' || disabled}
          className="
      flex-shrink-0 
      flex items-center justify-center
      w-16 h-16 rounded-full
    text-white dark:bg-blue-600
      hover:bg-blue-600 dark:hover:bg-blue-700
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
