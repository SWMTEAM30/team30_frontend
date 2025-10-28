import LucideIcon from '@/components/ui/icons/LucideIcon';

export default function SituationOption({
  option,
  handleSituationSelect,
}: {
  option: { text: string; icon: any; description: string };
  handleSituationSelect: Function;
}) {
  return (
    <button
      onClick={() => handleSituationSelect(option.text)}
      className="p-6 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl hover:border-blue dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-left group"
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center group-hover:bg-blue/20 transition-colors">
          <LucideIcon name={option.icon} color="blue-500" className="w-6 h-6" />
        </div>
        <div>
          <div className="font-semibold text-lg">{option.text}</div>
          <div className="text-md">{option.description}</div>
        </div>
      </div>
    </button>
  );
}
