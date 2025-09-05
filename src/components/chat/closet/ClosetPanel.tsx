import { activeCodinationAtom, closetAtom, codinationsAtom, panelAtom } from '@/atoms/chatAtoms';
import { cn } from '@/lib/utils';
import { useAtom, useSetAtom } from 'jotai';
import Image from 'next/image';

function ClothingCard({ cloth }: { cloth: ClosetCloth }) {
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);
  const isSelected = activeCodination.items.some((e) => e.id == cloth.id);
  const handleItemClick = () => {
    if (!isSelected)
      setActiveCodination((prev) => {
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          items: [...prev.items, cloth],
        };
      });
    else
      setActiveCodination((prev) => {
        return {
          id: prev.id,
          fitting_image: prev.fitting_image,
          items: prev.items.filter((e) => e.id !== cloth.id),
        };
      });
  };
  return (
    <div
      onClick={() => handleItemClick()}
      className={cn(
        'h-128 flex flex-col relative  bg-beige-200 border-2 cursor-pointer transition-all duration-200 hover:shadow-md group',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100 hover:border-blue-300',
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-square w-full h-full flex-grow overflow-hidden">
        <Image
          src={cloth.url}
          alt={cloth.id}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* 선택 상태 오버레이 */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{cloth.name}</h3>
      </div>
    </div>
  );
}

export default function ClosetPanel() {
  const setPanel = useSetAtom(panelAtom);
  const [closet, setCloset] = useAtom(closetAtom);
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);

  const handleSubmitFitting = () => {
    setPanel('fitting');
    setCodinations((prev) => {
      const newCodinations = prev.filter((e) => e.id !== activeCodination.id);
      return [...newCodinations, activeCodination];
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-y-auto p-4 h-11/12">
        <div className="grid grid-cols-3 gap-3 ">
          {closet.map((cloth, key) => (
            <ClothingCard key={key} cloth={cloth} />
          ))}
        </div>
      </div>
      <button
        className={`cursor-pointer h-1/12 btn bg-navy text-2xl text-white disabled:bg-blue-50`}
        disabled={activeCodination.items.length == 0}
        onClick={() => {
          handleSubmitFitting();
        }}
      >
        코디 추가하기
      </button>
    </div>
  );
}
