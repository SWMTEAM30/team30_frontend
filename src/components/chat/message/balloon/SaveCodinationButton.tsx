import LucideIcon from '@/components/ui/icons/LucideIcon';

interface SaveCodinationButtonProps {
  products: Product[];
  sourceMessage?: Message;
  onSaveCodination: (products: Product[], sourceMessage?: Message) => Promise<void>;
  isSaved: (products: Product[]) => boolean;
}

export default function SaveCodinationButton({
  products,
  sourceMessage,
  onSaveCodination,
  isSaved,
}: SaveCodinationButtonProps) {
  const saved = isSaved(products);

  const buttonClasses = `inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all self-start shadow-sm`;
  const colorClasses = saved
    ? 'bg-blue text-white hover:bg-navy-600'
    : 'bg-white dark:bg-slate-700 text-blue dark:text-blue-300 border border-blue dark:border-slate-600 hover:bg-blue/5 dark:hover:bg-slate-600';

  return (
    <button
      className={`${buttonClasses} ${colorClasses}`}
      onClick={async () => await onSaveCodination(products, sourceMessage)}
      disabled={saved}
      title={saved ? '이미 저장됨' : '코디 저장하기'}
    >
      <LucideIcon name={'Heart'} color={saved ? 'blue-50' : 'blue-500'} {...(saved ? { fill: 'currentColor' } : {})} />
      <span>{saved ? '저장됨' : '코디 저장하기'}</span>
    </button>
  );
}
