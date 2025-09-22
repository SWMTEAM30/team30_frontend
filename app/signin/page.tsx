import SigninSNSForm from '@/components/auth/SigninSNSForm';

export default function SigninPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue to-navy bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">로그인하고 서비스를 이용해보세요</p>
        </div>

        <div className="space-y-6">
          <SigninSNSForm />
        </div>
      </div>
    </div>
  );
}
