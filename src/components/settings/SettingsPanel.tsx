'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Camera } from 'lucide-react';
import ModelImageUpload from './ModelImageUpload';
import ThemeSettings from './ThemeSettings';

interface SettingsPanelProps {
  children?: React.ReactNode;
}

export default function SettingsPanel({ children }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            <ModelImageUpload />
          </div>

          {/* 테마 설정 */}
          <ThemeSettings />
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
