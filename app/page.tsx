import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, MapPin, Calendar, Heart } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-[600px] mx-auto bg-white shadow-xl shadow-gray-100 overflow-hidden relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-1">
          <span className="text-karrot">당근</span> 운세
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm font-medium text-gray-500 gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            <span>2026년</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 pb-24 overflow-y-auto">
        {/* Welcome Section */}
        <section className="mt-8 mb-12 text-center animate-slide-up">
          <div className="mb-6 inline-flex p-6 rounded-3xl bg-orange-50 ring-8 ring-orange-50/50">
            <span className="text-6xl animate-bounce">🥕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            2026년, 당신의 운세가<br />
            <span className="text-karrot">당근</span> 도착했어요!
          </h2>
          <p className="text-gray-500 text-sm px-4 leading-relaxed">
            AI가 분석한 정밀한 신년 운세를<br />
            이웃집처럼 편안하게 확인해보세요.
          </p>
        </section>

        {/* Feature List */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-bold text-gray-400 mb-2 px-1">이런 점이 특별해요</h3>

          <div className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <Sparkles className="w-5 h-5 text-karrot" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">1:1 맞춤 분석</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                이름과 생년월일만으로 AI가 분석하는<br />나만의 특별한 신년 가이드
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">다양한 주제</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                직업, 재물, 연애부터 건강까지<br />원하는 분야를 콕 집어서 알려드려요
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">따뜻한 조언</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                긍정적인 에너지를 담은<br />희망찬 메시지를 선물합니다
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 w-full max-w-[600px] p-4 bg-white border-t border-gray-100">
        <Link href="/fortune" className="block w-full">
          <Button
            className="w-full bg-karrot hover:bg-karrot text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-[0.98]"
          >
            내 운세 보러가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
