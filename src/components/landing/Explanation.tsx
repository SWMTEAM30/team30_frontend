import LucideIcon from '@/components/ui/icons/LucideIcon';
import { icons } from 'lucide-react';

interface ExplanationCard {
  iconName: keyof typeof icons;
  title: string;
  text?: string;
}

function ExplanationCard({ iconName, title, text }: ExplanationCard) {
  return (
    <div className="translate-y-12 transition-all duration-1000 ease-out pointer-events-none" data-scroll="card">
      <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-xl">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0 w-16 h-16 bg-blue rounded-2xl flex items-center justify-center">
            <LucideIcon name={iconName} color="beige-50" className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">{title}</h4>
            {text && <p className="text-lg text-gray-600 leading-relaxed">{text}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const ExplanationData: ExplanationCard[] = [
  {
    iconName: 'MessageSquare',
    title: '자연스러운 대화로 취향 파악',
    text: '복잡한 설문 없이 자연스러운 대화를 통해 당신의 스타일과 상황을 정확히 파악합니다. "회사 면접용 옷을 찾고 있어요" 같은 간단한 설명만으로도 완벽한 추천을 받을 수 있어요.',
  },
  {
    iconName: 'Sparkles',
    title: '체형과 상황을 고려한 맞춤 추천',
    text: '키, 몸무게, 선호도까지 모두 고려하여 당신에게 가장 어울리는 딱 한 벌만 추천합니다. 여러 옵션 중에서 고르는 스트레스 없이 바로 구매할 수 있는 완벽한 코디를 제안해드려요.',
  },
  {
    iconName: 'Timer',
    title: '30초면 완성되는 간편함',
    text: '긴 설문이나 복잡한 과정 없이 30초 만에 완벽한 스타일을 찾을 수 있습니다. 바쁜 일상 속에서도 빠르고 정확한 패션 솔루션을 제공해드려요.',
  },
  {
    iconName: 'ShoppingBag',
    title: '바로 구매 가능한 실용성',
    text: '추천받은 아이템을 바로 구매할 수 있어요. 패션에 대한 지식이 없어도 AI가 골라준 완벽한 한 벌로 자신감 넘치는 스타일을 완성하세요.',
  },
  {
    iconName: 'Check',
    title: '패션 고민, 이제 끝!',
  },
];

export default function Explanation() {
  return (
    <div className="transition-all duration-700 ease-out">
      <div className="py-16 space-y-8 max-w-6xl mx-auto px-4">
        {ExplanationData.map((card, key) => (
          <ExplanationCard key={key} iconName={card.iconName} title={card.title} text={card.text} />
        ))}
        <div className="h-48" />
      </div>
    </div>
  );
}
