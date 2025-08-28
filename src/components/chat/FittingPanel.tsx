import ImageDetailPanel from '@/components/chat/ImageDetailPanel';
import { useAtom, useAtomValue } from 'jotai';
import { activeImageTabIdAtom, imageTabsAtom } from '@/atoms/chatAtoms';
import PanelFrame from '@/components/chat/PanelFrame';
import PanelExtensionButton from '@/components/chat/PanelExtensionButton';

export default function ImagePanel({ top }: { top: number }) {
  const imageTabs = useAtomValue(imageTabsAtom);
  const [activeImageTabId, setActiveImageTabId] = useAtom(activeImageTabIdAtom);
  const activeTabData = imageTabs.find((tab) => tab.src === activeImageTabId);

  return (
    <>
      <PanelExtensionButton panelType={'fitting'} top={top} />
      <PanelFrame
        panelType={'fitting'}
        openedTabs={imageTabs}
        activeTabId={activeImageTabId}
        handleTabSelect={setActiveImageTabId}
        DetailPanel={<ImageDetailPanel imageData={activeTabData ?? null} />}
        detailNoExistsText={'선택된 옷이 없습니다.'}
      />
    </>
  );
}
