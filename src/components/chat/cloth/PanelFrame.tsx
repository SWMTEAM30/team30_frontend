export default function PanelFrame<T>({
  activeTabData,
  renderContent,
  detailNoExistsText = '선택된 컨텐츠가 없습니다',
}: {
  activeTabData: any;
  renderContent: (item: T) => React.ReactNode;
  detailNoExistsText?: string;
}) {
  return (
    <div className="flex-1 w-160 h-full overflow-y-auto">
      {activeTabData ? (
        <>{renderContent(activeTabData)}</>
      ) : (
        <div className="p-8 text-center text-gray-500">{detailNoExistsText}</div>
      )}
    </div>
  );
}
