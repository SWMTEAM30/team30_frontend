import SigninSNSForm from '@/components/auth/SigninSNSForm';
import Image from 'next/image';

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 배경 색상 */}
      <div className="absolute inset-0"></div>

      {/* 배경 장식 요소들 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-16 space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-lg p-4">
              <Image
                src="/TFT_icon.png"
                alt="The First Take"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-600 bg-clip-text">SNS 로그인</h1>
              <p className="mt-4 text-gray-600 text-lg">패션 AI와 함께 나만의 스타일을 찾아보세요</p>
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-8">
            <SigninSNSForm />
          </div>

          {/* 푸터 */}
          {/* <div className="text-center pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">
              로그인 시 서비스 이용약관 및 개인정보처리방침에 <br />
              동의하는 것으로 간주됩니다.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
