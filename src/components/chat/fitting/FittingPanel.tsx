import Image from 'next/image';
import { useAtom } from 'jotai';
import { activeCodinationAtom, codinationsAtom } from '@/atoms/chatAtoms';
import ChatPanelCodination from '@/components/chat/fitting/ChatPanelCodination';

export default function FittingPanel() {
  const [codinations, setCodinations] = useAtom(codinationsAtom);
  const [activeCodination, setActiveCodination] = useAtom(activeCodinationAtom);

  return (
    <>
      <div className="h-2/3 p-4 overflow-y-auto grid grid-cols-2 gap-6">
        {/* 왼쪽: 피팅 이미지 */}
        <div className="flex bg-beige-300 flex-col">
          <BasicProfile />
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className="flex flex-col space-y-4 overflow-y-auto">
          {/* 기본 정보 */}
          <div className="h-full bg-beige-300 dark:bg-slate-800 rounded-2xl p-4">
            <h3 className="text-4xl font-bold text-navy-500 dark:text-white my-6">코디 아이템</h3>
            <h4 className="text-2xl font-semibold text-navy-500 dark:text-white mt-8 mb-4"></h4>
            <div className="space-y-2">
              {activeCodination
                ? activeCodination.cloths.map((cloth: ClosetCloth, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-beige-500 rounded-lg">
                      <div className="flex-shrink-0 flex items-center justify-center h-40">
                        <Image
                          src={cloth.url}
                          alt={cloth.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover h-full"
                        />
                      </div>
                      {/* 텍스트 영역 */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xl text-navy-500 dark:text-white mb-1 line-clamp-2">
                          {cloth.name}
                        </p>
                        <p className="text-md text-navy-400 dark:text-navy-300 line-clamp-3">{cloth.description}</p>
                      </div>
                    </div>
                  ))
                : '구성된 아이템이 없습니다'}
            </div>
          </div>
        </div>
      </div>
      <ChatPanelCodination />
    </>
  );
}

function BasicProfile() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-blue-400 dark:text-navy-500 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-yellow-150 dark:bg-slate-600 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <p className="text-base font-medium">피팅 이미지</p>
        <p className="text-sm mt-1">현재 뷰: 정면</p>
      </div>
    </div>
  );
}
