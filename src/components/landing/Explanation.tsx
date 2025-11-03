export default function Explanation() {
  return (
    <section className="container mx-auto px-4 py-64 my-64 text-center">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 bg-gradient-hero bg-clip-text">
          당신을 위한 완벽한 스타일,
          <br />
          <span className="text-black">AI 전문가</span>와 함께 찾아드립니다.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
          AI가 당신의 취향과 체형을 분석하여 딱 맞는 옷 한 벌을 추천합니다.
        </p>
      </div>
    </section>
  );
}
