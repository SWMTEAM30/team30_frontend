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
      <DialogContent className="max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Settings className="h-5 w-5" />
            설정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 모델 이미지 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Camera className="h-4 w-4" />
              가상 피팅 모델 이미지
            </div>
            <ModelImageUpload />
          </div>

          {/* 테마 설정 */}
          <ThemeSettings />
        </div>
      </DialogContent>
    </Dialog>
  );
}
