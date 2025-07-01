'use client';

import Link from 'next/link';
import LucideIcon from '@/components/icons/LucideIcon';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 text-blue rounded-full text-lg font-medium mb-8 shadow-sm">
            <LucideIcon name={'AlarmClock'} color={'blue-500'} className="w-5 h-5 mr-2 dark" />
            패션을 잘 모르겠다면?
          </div>

          <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            고민 없이
            <br />
            <span className="text-blue">딱 한 벌</span>만 추천
          </h2>

          <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-4">"뭘 입어야 할지 모르겠어요..." 걱정 끝!</p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            간단한 설명만으로 AI가 당신에게 완벽한 옷 한 벌을 골라드립니다.
          </p>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-900 font-medium">상황 설명</span>
              </div>
              <LucideIcon name={'ArrowRight'} className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-500">AI 분석</span>
              </div>
              <LucideIcon name={'ArrowRight'} className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-500">완벽한 한 벌</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="bg-gray-50 p-8">
            <div className="text-center">
              <Link
                href="/chat"
                className="dark inline-flex items-center px-12 py-5 bg-blue text-beige-50 font-bold rounded-2xl hover:bg-navy-600 transition-all transform hover:scale-105 shadow-lg text-xl"
              >
                <LucideIcon name={'Wand'} color="beige-50" className="mr-4 w-6 h-6 " />
                AI가 딱 한 벌 골라주기
                <LucideIcon name={'ArrowRight'} color="beige-50" className="ml-4 w-6 h-6" />
              </Link>
              <p className="text-gray-500 mt-4 text-lg">⏱️ 30초면 완성! 복잡한 설문 없어요</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <LucideIcon name={'User'} className="w-8 h-8 text-blue mr-3" />
              <div>
                <div className="font-semibold text-gray-900">김○○ (25세)</div>
                <div className="text-sm text-gray-500">패션 완전 초보</div>
              </div>
            </div>
            <p className="text-gray-700">"정말 옷에 대해 아무것도 몰랐는데, 딱 하나만 추천해줘서 너무 편해요!"</p>
          </div>
          <div className="bg-white/80 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <LucideIcon name={'User'} className="w-8 h-8 text-blue mr-3" />
              <div>
                <div className="font-semibold text-gray-900">이○○ (30세)</div>
                <div className="text-sm text-gray-500">직장인</div>
              </div>
            </div>
            <p className="text-gray-700">"고민할 시간도 없는데 첫 추천이 완벽했어요. 바로 주문했습니다."</p>
          </div>
          <div className="bg-white/80 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <LucideIcon name={'User'} className="w-8 h-8 text-blue mr-3" />
              <div>
                <div className="font-semibold text-gray-900">박○○ (22세)</div>
                <div className="text-sm text-gray-500">대학생</div>
              </div>
            </div>
            <p className="text-gray-700">"여러 옵션 중에 고르는 스트레스가 없어서 좋아요. 정말 간단!"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
