import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import ImagePanel from '@/components/chat/ImagePanel';
import WikiPanel from '@/components/chat/WikiPanel';
import { useAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';

export default function SidePanel({}) {
  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-beige border-l border-gray-200 shadow-xl z-40 
                 flex flex-row transition-transform duration-500 ease-in-out
                 ${activePanelType != null ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button
          onClick={() => {
            if (activePanelType == 'image') setActivePanelType(null);
            else setActivePanelType('image');
          }}
          className="absolute top-36 -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          title={activePanelType === 'image' ? '패널 닫기' : '패널 열기'}
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${activePanelType === 'image' ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        <button
          onClick={() => {
            if (activePanelType == 'wiki') setActivePanelType(null);
            else setActivePanelType('wiki');
          }}
          className="absolute top-80 -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          title={activePanelType === 'wiki' ? '패널 닫기' : '패널 열기'}
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${activePanelType === 'wiki' ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        {activePanelType === 'image' && <ImagePanel />}
        {activePanelType === 'wiki' && <WikiPanel />}
      </div>
    </>
  );
}
