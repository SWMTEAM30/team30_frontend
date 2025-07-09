import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function ImageDetailPanel({
  imageData,
  onClose,
}: {
  imageData: {
    src: string;
    name: string;
    description: string;
    tags: string[];
  } | null;
  onClose: () => void;
}) {
  if (!imageData) return null;

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">패션 아이템 상세 정보</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 이미지 */}
        <div className="mb-4">
          <Image
            src={imageData.src}
            alt={imageData.name}
            width={300}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* 정보 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{imageData.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{imageData.description}</p>
          </div>

          {/* 태그 */}
          {imageData.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">스타일 태그</h4>
              <div className="flex flex-wrap gap-1">
                {imageData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-auto mt-8">
          <Link href={'https://github.com/MindulMendul'} target="_blank">
            <button className="w-full btn rounded-2xl p-5 bg-blue text-white text-2xl">사이트로 이동하기</button>{' '}
          </Link>
        </div>
      </div>
    </div>
  );
}
