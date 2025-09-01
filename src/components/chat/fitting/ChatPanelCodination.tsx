import { codinationAtom } from '@/atoms/chatAtoms';
import { useAtomValue } from 'jotai';

export default function ChatPanelCodination() {
  const codination = useAtomValue(codinationAtom);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {codination.map((cloth, key) => (
          <div key={key} className="h-60 w-60">
            {cloth.image}
          </div>
        ))}
      </div>
      {codination.map((cloth, key) => (
        <div key={key} className="h-60 w-60">
          {cloth.title}
        </div>
      ))}
    </div>
  );
}
