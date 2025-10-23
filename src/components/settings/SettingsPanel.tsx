'use client';

import { useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Camera, X, Loader2 } from 'lucide-react';
import { saveUserProfile } from '@/lib/indexedDB';
import { postChatUpload } from '@/api/chatAPI';

interface SettingsPanelProps {
  children?: React.ReactNode;
}

export default function SettingsPanel({ children }: SettingsPanelProps) {
  const [user, setUser] = useAtom(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload 호출됨', event.target.files);
    const file = event.target.files?.[0];
    console.log('선택된 파일:', file);
    console.log('현재 사용자:', user);

    if (file && user) {
      console.log('파일 처리 시작');
      setIsLoading(true);

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        console.log('파일 크기 초과:', file.size);
        alert('파일 크기는 5MB 이하여야 합니다.');
        setIsLoading(false);
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        console.log('잘못된 파일 타입:', file.type);
        alert('이미지 파일만 업로드 가능합니다.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // 즉시 미리보기 표시
      const response = await postChatUpload(formData);
      if (response.status == 'fail') {
        console.error('사진 업로드 중 에러');
        return;
      }

      const result = response.data;
      setPreviewImage(result);
      console.log('미리보기 이미지 설정됨');

      const newProfile: User = {
        ...user,
        modelImage: result,
      };

      setUser(newProfile);
      await saveUserProfile(newProfile);
      console.log('사용자 프로필 저장 완료');
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async () => {
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
  };

  const handleDarkModeToggle = async () => {
    if (user) {
      const newProfile: User = {
        ...user,
        darkMode: !user?.darkMode,
      };

      setUser(newProfile);
      await saveUserProfile(newProfile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            설정
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            설정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 모델 이미지 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Camera className="h-4 w-4" />
              가상 피팅 모델 이미지
            </div>
            <div className="pl-6">
              {!user && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <p className="text-gray-500 mb-2">로그인이 필요합니다</p>
                  <p className="text-xs text-gray-400">이미지 업로드를 위해 먼저 로그인해주세요</p>
                </div>
              )}
              {user && (
                <>
                  {/* 로딩 상태 */}
                  {isLoading && (
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                      <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-blue-600 font-medium">이미지를 처리하는 중...</p>
                    </div>
                  )}

                  {/* 이미지가 있거나 미리보기가 있는 경우 */}
                  {!isLoading && (user?.modelImage || previewImage) && (
                    <div className="space-y-3">
                      <div className="relative group">
                        <img
                          src={previewImage || user?.modelImage || '/model_image.jpg'}
                          alt="현재 설정된 모델 이미지"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        {/* 오버레이 버튼들 */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
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
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">✅ 모델 이미지가 설정되었습니다</p>
                        <p className="text-xs text-gray-500 mt-1">이 이미지가 가상 피팅에 사용됩니다</p>
                      </div>
                    </div>
                  )}

                  {/* 이미지가 없는 경우 */}
                  {!isLoading && !user?.modelImage && !previewImage && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">가상 피팅에 사용할 모델 이미지를 업로드하세요</p>
                      <p className="text-xs text-gray-400 mb-4">JPG, PNG, GIF 파일 (최대 5MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => {
                          console.log('이미지 선택 버튼 클릭됨');
                          fileInputRef.current?.click();
                        }}
                        variant="outline"
                        className="gap-2 hover:bg-blue-50"
                      >
                        <Camera className="h-4 w-4" />
                        이미지 선택
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 다크모드 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings className="h-4 w-4" />
              테마 설정
            </div>
            <div className="pl-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={user?.darkMode || false}
                  onChange={handleDarkModeToggle}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">다크 모드</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex gap-2">
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
            취소
          </Button>
          <Button onClick={() => setIsOpen(false)} className="flex-1">
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
