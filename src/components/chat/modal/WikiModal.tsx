'use client';

import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MDXClient } from 'next-mdx-remote-client';

interface WikiModalProps {
  wiki: any;
  children: React.ReactNode;
}

export default function WikiModal({ wiki, children }: WikiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (open) {
        // 모달을 열 때 API 호출하여 상품 데이터 가져오기
        setIsOpen(true);
        console.log(wiki);
      } else {
        // 모달을 닫을 때
        setIsOpen(false);
      }
    },
    [wiki],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] h-[85vh] xl:max-w-7xl p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-4xl font-bold text-gray-900 dark:text-white">{wiki.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <div className="prose text-lg prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-img:w-[300px] prose-img:h-auto prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6 prose-img:block">
              <MDXClient {...wiki.content} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
