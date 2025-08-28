import { activePanelTypeAtom } from '@/atoms/chatAtoms';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';

export default function PanelExtensionButton({
  panelType,
  top,
}: {
  panelType: 'image' | 'wiki' | 'fitting';
  top: number;
}) {
  const [activePanelType, setActivePanelType] = useAtom(activePanelTypeAtom);
  console.log(top);
  return (
    <button
      onClick={() => {
        if (activePanelType == panelType) setActivePanelType(null);
        else setActivePanelType(panelType);
      }}
      className={cn(
        `top-${top}`,
        `absolute -translate-y-1/2 left-0 h-36 -translate-x-full z-20 bg-beige p-2 rounded-l-lg border border-gray-200 hover:bg-gray-100 transition-colors`,
      )}
      title={activePanelType === 'fitting' ? '패널 닫기' : '패널 열기'}
    >
      <ChevronLeft
        size={20}
        className={`transition-transform duration-300 ${activePanelType === 'fitting' ? 'rotate-180' : 'rotate-0'}`}
      />
    </button>
  );
}
