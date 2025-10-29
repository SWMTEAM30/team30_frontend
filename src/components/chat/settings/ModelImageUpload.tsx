'use client';

import { useState, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { saveUserProfile } from '@/lib/indexedDB';
import { postChatUpload } from '@/api/chatAPI';
import Image from 'next/image';

export default function ModelImageUpload() {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file && user) {
        setIsLoading(true);

        // 파일 크기 검증 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          setIsLoading(false);
          return;
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          setIsLoading(false);
          return;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await postChatUpload(formData);
          if (response.status === 'fail') {
            console.error('사진 업로드 중 에러');
            setIsLoading(false);
            return;
          }

          const result = response.data;
          setPreviewImage(result);

          const newProfile: User = {
            ...user,
            modelImage: result,
          };

          setUser(newProfile);
          await saveUserProfile(newProfile);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드에 실패했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    },
    [user, setUser],
  );

  const handleRemoveImage = useCallback(async () => {
    if (user) {
      const newProfile: User = {
        ...user,
        modelImage: null,
      };

      setUser(newProfile);
      setPreviewImage(null);
      await saveUserProfile(newProfile);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [user, setUser]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!user) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-slate-700">
        <p className="text-gray-500 mb-2">로그인이 필요합니다</p>
        <p className="text-xs text-gray-400">이미지 업로드를 위해 먼저 로그인해주세요</p>
      </div>
    );
  }

  return (
    <div className="pl-6">
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-8 text-center bg-blue-50 dark:bg-blue-900/20">
          <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-blue-600 font-medium">이미지를 처리하는 중...</p>
        </div>
      )}

      {/* 이미지가 있거나 미리보기가 있는 경우 */}
      {!isLoading && (user?.modelImage || previewImage) && (
        <div className="space-y-3">
          <div className="relative group">
            <Image
              src={previewImage || user?.modelImage || '/model_image.jpg'}
              alt="현재 설정된 모델 이미지"
              width={300}
              height={300}
              className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            {/* 오버레이 버튼들 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={handleFileSelect}
                  className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  title="편집"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="삭제"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* 숨겨진 파일 입력 */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">✅ 모델 이미지가 설정되었습니다</p>
            <p className="text-xs text-gray-500 mt-1">이 이미지가 가상 피팅에 사용됩니다</p>
          </div>
        </div>
      )}

      {/* 이미지가 없는 경우 */}
      {!isLoading && !user?.modelImage && !previewImage && (
        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">가상 피팅에 사용할 모델 이미지를 업로드하세요</p>
          <p className="text-xs text-gray-400 mb-4">JPG, PNG, GIF 파일 (최대 5MB)</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <Button
            onClick={handleFileSelect}
            variant="outline"
            className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Camera className="h-4 w-4" />
            이미지 선택
          </Button>
        </div>
      )}
    </div>
  );
}
