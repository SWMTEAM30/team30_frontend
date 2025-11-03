import { MessageSquare, User, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: '자연스러운 대화로 취향 파악',
      description:
        "복잡한 설문 없이 자연스러운 대화를 통해 당신의 스타일과 상황을 정확히 파악합니다. '회사 면접용 옷을 찾고 있어요' 같은 간단한 설명만으로도 완벽한 추천을 받을 수 있어요.",
      align: 'left',
      img: '/landing/ai_chat.png',
    },
    {
      icon: User,
      title: '체형과 상황을 고려한 맞춤 추천',
      description:
        '키, 몸무게, 선호도까지 모두 고려하여 당신에게 가장 어울리는 딱 한 벌만 추천합니다. 여러 옵션 중에서 고르는 스트레스 없이 바로 구매할 수 있는 완벽한 코디를 제안해드려요.',
      align: 'right',
      img: '/landing/fit_profit.png',
    },
    {
      icon: Clock,
      title: '30초면 완성되는 간편함',
      description:
        '긴 설문이나 복잡한 과정 없이 30초 만에 완벽한 스타일을 찾을 수 있습니다. 바쁜 일상 속에서도 빠르고 정확한 패션 솔루션을 제공해드려요.',
      align: 'left',
      img: '/landing/fit_model.png',
    },
    {
      icon: ShoppingBag,
      title: '바로 구매 가능한 실용성',
      description:
        '추천받은 아이템을 바로 구매할 수 있어요. 패션에 대한 지식이 없어도 AI가 골라준 완벽한 한 벌로 자신감 넘치는 스타일을 완성하세요.',
      align: 'right',
      img: '/landing/clothes_modal.png',
    },
  ];

  return (
    <section className="w-full px-4 py-20">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            feature.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
          } items-center gap-12 m-24 last:mb-0 animate-slide-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-1">
            <div className="bg-primary-lighter p-6 rounded-2xl w-fit mb-6">
              <feature.icon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-foreground">{feature.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
          <div className={`relative flex-1 w-[400px] h-[600px]`}>
            {feature.img ? (
              <Image src={feature.img} alt={feature.title} fill className="object-contain" />
            ) : (
              <div className="bg-gradient-subtle rounded-2xl p-12 h-80 shadow-md flex items-center justify-center">
                <div className="text-center">
                  <feature.icon className="w-24 h-24 text-primary mx-auto opacity-20" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
