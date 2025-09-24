'use client';

import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useState } from 'react';

export default function AuthCheckDemo() {
  const { user, isAuthenticated, isChecking, checkAuth, refreshUser } = useAuthCheck();
  const [result, setResult] = useState<string>('');

  const handleCheckAuth = async () => {
    const authResult = await checkAuth({
      alertMessage: '이 기능을 사용하려면 로그인이 필요합니다.'
    });
    
    setResult(`인증 결과: ${authResult.isAuthenticated ? '성공' : '실패'}`);
  };

  const handleCheckAuthNoRedirect = async () => {
    const authResult = await checkAuth({
      redirectToSignin: false,
      showAlert: false
    });
    
    setResult(`인증 결과 (리다이렉트 없음): ${authResult.isAuthenticated ? '성공' : '실패'}`);
  };

  const handleRefreshUser = async () => {
    const refreshResult = await refreshUser();
    setResult(`사용자 정보 갱신: ${refreshResult.success ? '성공' : '실패'}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">Auth Check Hook 데모</h3>
      
      <div className="space-y-4">
        {/* 현재 상태 */}
        <div className="p-3 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">현재 상태</h4>
          <p><span className="font-medium">인증됨:</span> {isAuthenticated ? '예' : '아니오'}</p>
          <p><span className="font-medium">로딩 중:</span> {isChecking ? '예' : '아니오'}</p>
          <p><span className="font-medium">사용자:</span> {user ? `${user.username} (${user.userId})` : '없음'}</p>
        </div>

        {/* 버튼들 */}
        <div className="space-y-2">
          <button
            onClick={handleCheckAuth}
            disabled={isChecking}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            로그인 확인 (리다이렉트 포함)
          </button>
          
          <button
            onClick={handleCheckAuthNoRedirect}
            disabled={isChecking}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            로그인 확인 (리다이렉트 없음)
          </button>
          
          <button
            onClick={handleRefreshUser}
            disabled={isChecking}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            사용자 정보 갱신
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
