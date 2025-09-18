'use client';

import { examplesAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/hooks/useChatHandler';
import { useChatStream } from '@/hooks/useChatStream';
import { useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';

export default function ExampleSuggestions() {
  //const { handleExampleSelect } = useChatHandlers();
  const messageExamples = useAtomValue(examplesAtom);
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomID');
  const { mutate } = useChatStream();

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
        다음에 물어보고 싶은 것
      </h3>
      <div className="grid gap-3">
        {messageExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => {
              mutate({ roomId, inputValue: example });
            }}
            className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          >
            <p className="text-gray-700 dark:text-gray-200">{example}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
