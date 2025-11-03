import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

function FAQItem({ value, question, answer }: { value: string; question: string; answer: string }) {
  return (
    <AccordionItem className={'my-5'} value={value}>
      <AccordionTrigger className="text-left text-2xl font-semibold">{question}</AccordionTrigger>
      <AccordionContent className="text-xl">{answer}</AccordionContent>
    </AccordionItem>
  );
}

export default function FAQ() {
  const FAQList = [
    {
      v: 'item-1',
      q: 'AI가 어떻게 제 체형을 파악하나요?',
      a: `간단한 대화를 통해 키, 몸무게, 체형 특징을 입력받습니다. 복잡한 측정이나 사진 업로드 없이도 정확한 추천이 가능하도록 설계되었습니다. 선호하는 핏과 스타일도 함께 고려합니다.`,
    },
    {
      v: 'item-2',
      q: '추천받은 옷이 마음에 안 들면 어떻게 하나요?',
      a: `언제든지 다시 대화를 시작하여 피드백을 주실 수 있습니다. "좀 더 캐주얼한 스타일로", "다른 색상으로" 등의 요청으로 즉시 새로운 추천을 받을 수 있습니다.`,
    },
    {
      v: 'item-3',
      q: '어떤 쇼핑몰의 상품을 추천받나요?',
      a: `현재는 무신사 등 국내 주요 온라인 쇼핑몰 및 브랜드 공식몰과 연동되어 있습니다. 다양한 가격대와 스타일의 제품 중에서 가장 적합한 것을 추천해드립니다.`,
    },
    {
      v: 'item-4',
      q: '정말 30초면 되나요?',
      a: `네! "데이트용 캐주얼 룩 찾아줘" 같은 간단한 설명만으로 즉시 추천을 받을 수 있습니다. 더 정확한 추천을 원하시면 체형 정보를 추가로 입력하실 수 있지만, 30초 이내로 빠르게 답변을 얻으실 수도 있습니다.`,
    },
    {
      v: 'item-5',
      q: '개인정보는 안전한가요?',
      a: `모든 개인정보는 암호화되어 안전하게 보관되며, 오직 추천 서비스 제공 목적으로만 사용됩니다. 제3자에게 공유되지 않으며, 언제든지 데이터 삭제를 요청하실 수 있습니다.`,
    },
  ];
  return (
    <section className="max-w-[1024px] mx-auto px-20 py-20">
      <div className="text-center mb-12">
        <h3 className="text-5xl font-bold mb-4">자주 묻는 질문</h3>
        <p className="text-muted-foreground">궁금하신 점을 해결해드립니다</p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {FAQList.map((e, i) => (
          <FAQItem key={i} value={e.v} question={e.q} answer={e.a} />
        ))}
      </Accordion>
    </section>
  );
}
