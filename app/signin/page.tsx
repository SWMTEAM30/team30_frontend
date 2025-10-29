import SigninSNSForm from '@/components/auth/SigninSNSForm';
import LoginBackground from '@/components/auth/LoginBackground';
import Image from 'next/image';
import LoginBackgroundDark from '@/components/auth/LoginBackgroundDark';

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <LoginBackground />
      <LoginBackgroundDark />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white/70 dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl  p-16 space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white dark:bg-slate-800 rounded-3xl shadow-lg dark:shadow-none p-4">
              <Image
                src="/TFT_icon.png"
                alt="The First Take"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r  bg-clip-text">SNS 로그인</h1>
              <p className="mt-4  text-lg">패션 AI와 함께 나만의 스타일을 찾아보세요</p>
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-8">
            <SigninSNSForm />
          </div>

          {/* 푸터 */}
          {/* <div className="text-center pt-4 border-t border-gray-200/50">
            <p className="text-sm text-gray-500">
              로그인 시 서비스 이용약관 및 개인정보처리방침에 <br />
              동의하는 것으로 간주됩니다.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
