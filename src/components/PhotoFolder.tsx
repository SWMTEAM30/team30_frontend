'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GraphPage from '@/../app/graph/page';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  description: string;
  tags: string[];
}

interface PhotoFolderProps {
  photos: Photo[];
}

export const PhotoFolder = ({ photos }: PhotoFolderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 최대 9개의 썸네일만 표시
  const thumbnails = photos.slice(0, 9);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="my-6">
          <h3 className="text-sm font-medium mb-3 text-gray-600">패션 아이템 이미지</h3>
          <div className="w-32 h-32 bg-[#F1FAFB] rounded-lg border-2 border-dashed border-[#4993FA] p-2">
            <div
              className={`grid ${thumbnails.length == 1 ? 'grid-cols-1' : thumbnails.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-1 h-full`}
            >
              {thumbnails.map((t, index) => (
                <div key={index} className="bg-white rounded border overflow-hidden">
                  <Image
                    width={300}
                    height={300}
                    src={t.url}
                    alt={t.description}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className=" sm:max-w-[80vw] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-[#4993FA]">사진 폴더</DialogTitle>
        </DialogHeader>

        <GraphPage />
      </DialogContent>
    </Dialog>
  );
};
