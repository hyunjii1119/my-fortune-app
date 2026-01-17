'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Calendar, Sparkles } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';

const topics = [
    { id: 'career', label: '커리어/진로', emoji: '💼' },
    { id: 'wealth', label: '재물/금전운', emoji: '💰' },
    { id: 'love', label: '연애/인간관계', emoji: '💕' },
    { id: 'health', label: '건강', emoji: '🏃' },
    { id: 'study', label: '학업/성장', emoji: '📚' },
    { id: 'overall', label: '종합운세', emoji: '⭐' },
];

export default function HistoryPage() {
    const { user, isLoaded } = useUser();
    const fortunes = useQuery(api.fortunes.getUserFortunes);
    const [selectedId, setSelectedId] = useState<Id<"fortunes"> | null>(null);

    const selectedFortune = fortunes?.find(f => f._id === selectedId);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTopicEmoji = (topicId: string) => {
        return topics.find(t => t.id === topicId)?.emoji || '⭐';
    };

    return (
        <div className="flex flex-col min-h-screen max-w-[600px] mx-auto bg-white shadow-xl shadow-gray-100 relative">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/fortune">
                        <Button variant="ghost" size="icon" className="-ml-2 hover:bg-gray-50 text-gray-900">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold ml-2 text-gray-900">
                        내 운세 기록
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {isLoaded && user && (
                        <span className="text-sm text-gray-500 hidden sm:inline">
                            {user.firstName || user.username}님
                        </span>
                    )}
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 pb-24">
                {!fortunes ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <Sparkles className="w-12 h-12 text-gray-300 animate-pulse" />
                        <p>운세 기록을 불러오는 중...</p>
                    </div>
                ) : fortunes.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-gray-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-600 mb-2">
                                아직 운세를 생성하지 않았습니다
                            </p>
                            <p className="text-sm text-gray-400">
                                첫 운세를 확인해보세요!
                            </p>
                        </div>
                        <Link href="/fortune">
                            <Button className="mt-4 bg-karrot hover:bg-karrot text-white">
                                운세 보러가기
                            </Button>
                        </Link>
                    </div>
                ) : selectedFortune ? (
                    /* Detail View */
                    <div className="animate-slide-up">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedId(null)}
                            className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            목록으로
                        </Button>

                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                                    {getTopicEmoji(selectedFortune.topic)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {selectedFortune.name}님의 <span className="text-karrot">{selectedFortune.topicLabel}</span>
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(selectedFortune.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-900">운세 온도</span>
                                    <span className="text-lg font-bold text-karrot">{selectedFortune.temperature.toFixed(1)}°C</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-karrot"
                                        style={{ width: `${Math.min(selectedFortune.temperature, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-gray max-w-none">
                                {selectedFortune.fortune.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="text-gray-800 leading-7 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-4">
                            총 {fortunes.length}개의 운세 기록
                        </p>

                        {fortunes.map((fortune) => (
                            <Card
                                key={fortune._id}
                                onClick={() => setSelectedId(fortune._id)}
                                className="p-5 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-karrot/30"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                                        {getTopicEmoji(fortune.topic)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-gray-900">
                                                {fortune.topicLabel}
                                            </h3>
                                            <span className="text-xs font-bold text-karrot">
                                                {fortune.temperature.toFixed(1)}°C
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {fortune.fortune.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(fortune.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
