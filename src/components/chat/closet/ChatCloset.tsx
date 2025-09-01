import { activeImageTabIdAtom } from '@/atoms/chatAtoms';
import { useChatHandlers } from '@/hooks/useChatHandler';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import Image from 'next/image';

function TabButton({ tab }: { tab: any }) {
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const { handleCloseTab } = useChatHandlers();

  return (
    <button
      onClick={() => setActiveImageTabId(tab.src)}
      className={`${activeImageTabId === tab.src ? 'ring-2 ring-blue-500' : 'hover:opacity-80'}`}
    >
      <Image src={tab.src} alt={tab.name} width={64} height={64} className="h-64 w-56 object-cover" />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleCloseTab(tab.src);
        }}
        className="absolute top-0 right-0 m-1 w-5 h-5 bg-black/50 text-white text-xs rounded-full flex items-center justify-center"
        title="탭 닫기"
      >
        asdfasdf
      </div>
    </button>
  );
}

export default function ChatCloset({ tabs }: { tabs: string[] }) {
  return (
    <div
      className={cn(
        `h-full w-60 border-r border-gray-200 bg-beige flex flex-col items-center gap-2 overflow-y-auto p-2`,
      )}
    >
      {tabs.map((tab, key) => (
        <TabButton tab={tab} key={key} />
      ))}
    </div>
  );
}
