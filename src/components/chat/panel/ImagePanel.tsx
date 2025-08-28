import Image from 'next/image';
import Link from 'next/link';
import { useAtomValue, useAtom } from 'jotai';
import { activeImageTabIdAtom, imageTabsAtom } from '@/atoms/chatAtoms';
import PanelFrame from '@/components/chat/panel/PanelFrame';
import { useChatHandlers } from '@/components/chat/area/ChatContextProvider';

function ImageTabButton({ tab }: { tab: any }) {
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const { handleCloseTab } = useChatHandlers();

  return (
    <button
      key={tab.id}
      onClick={() => setActiveImageTabId(tab.id)}
      className={`${activeImageTabId === tab.src ? 'ring-2 ring-blue-500' : 'hover:opacity-80'}`}
    >
      <Image src={tab.src} alt={tab.name} width={64} height={64} className="h-64 w-56 object-cover" />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleCloseTab(tab.src);
        }}
        className="absolute top-0 right-0 m-1 w-5 h-5 bg-black/50 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-500"
        title="탭 닫기"
      >
        ×
      </div>
    </button>
  );
}

function ImageDetailPanel({ image }: { image: MessageImage | null }) {
  if (!image) return null;
  return (
    <div className="max-h-full bg-beige dark:bg-gray-800">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">패션 아이템 상세 정보</h2>
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 이미지 */}
        <div className="mb-4 flex items-center justify-center min-h-[200px]">
          <Image
            src={image.src}
            alt={image.name}
            width={288}
            height={384}
            className="w-fullh-96 object-cover rounded-lg"
          />
        </div>

        {/* 정보 */}
        <div className="space-y-4 max-w-[288px] mx-auto">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{image.name}</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{image.content.content}</p>
          </div>

          {/* 태그 */}
          {image.tags.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">스타일 태그</h4>
              <div className="flex flex-wrap gap-1">
                {image.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-md rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-auto mt-8">
          <Link href={`https://www.musinsa.com/products/${image.content.product_id}`} target="_blank">
            <button className="w-full btn rounded-md p-5 bg-beige text-blue text-xl font-bold">
              구매페이지로 이동하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ImagePanel({ top }: { top: `top-${number}` }) {
  const imageTabs = useAtomValue(imageTabsAtom);
  const activeImageTabId = useAtomValue(activeImageTabIdAtom);
  const activeTabData = imageTabs.find((tab) => tab.src === activeImageTabId);
  return (
    <>
      <PanelFrame<MessageImage>
        panelType={'image'}
        top={top}
        activeTabData={activeTabData}
        tabs={imageTabs}
        renderTab={(tab) => <ImageTabButton tab={tab} />}
        renderContent={(activeTab) => <ImageDetailPanel image={activeTab} />}
        detailNoExistsText="표시할 이미지를 선택해주세요."
      />
    </>
  );
}
