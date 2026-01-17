'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { ChevronLeft, Loader2, ThermometerSun } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const topics = [
    { id: 'career', label: '커리어/진로', emoji: '💼' },
    { id: 'wealth', label: '재물/금전운', emoji: '💰' },
    { id: 'love', label: '연애/인간관계', emoji: '💕' },
    { id: 'health', label: '건강', emoji: '🏃' },
    { id: 'study', label: '학업/성장', emoji: '📚' },
    { id: 'overall', label: '종합운세', emoji: '⭐' },
];

export default function FortunePage() {
    const { user, isLoaded } = useUser();
    const saveFortune = useMutation(api.fortunes.saveFortune);
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [topic, setTopic] = useState('career');
    const [showFortune, setShowFortune] = useState(false);
    const [fortune, setFortune] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [temperature, setTemperature] = useState(36.5);

    // Set default name from user's first name when loaded
    useEffect(() => {
        if (isLoaded && user && !name) {
            setName(user.firstName || user.username || '당근이');
        }
    }, [isLoaded, user, name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !birthDate || !topic) return;

        setShowFortune(true);
        setFortune('');
        setIsLoading(true);
        // Random initial temperature based on luck (just for fun visual)
        const newTemperature = 36.5 + Math.random() * 63.5;
        setTemperature(newTemperature);

        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, birthDate, topic }),
            });

            if (!response.ok || !response.body) throw new Error('Failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fortuneText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                fortuneText += text;
                setFortune(fortuneText);
            }

            // Save to Convex after fortune is generated
            const selectedTopic = topics.find(t => t.id === topic);
            await saveFortune({
                name,
                birthDate,
                topic,
                topicLabel: selectedTopic?.label || topic,
                fortune: fortuneText,
                temperature: newTemperature,
            });
        } catch {
            alert('오류가 발생했어요. 잠시 후 다시 시도해주세요.');
            setShowFortune(false);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedTopic = topics.find(t => t.id === topic);

    return (
        <div className="flex flex-col min-h-screen max-w-[600px] mx-auto bg-white shadow-xl shadow-gray-100 relative">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2 hover:bg-gray-50 text-gray-900">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold ml-2 text-gray-900">
                        {showFortune ? '운세 결과' : '정보 입력'}
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

            <main className="flex-1 overflow-y-auto pb-24">
                {!showFortune ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-8 animate-slide-up">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base font-bold text-gray-900">닉네임</Label>
                                <Input
                                    id="name"
                                    placeholder="당근이"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 text-lg border-x-0 border-t-0 border-b-2 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-karrot placeholder:text-gray-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthDate" className="text-base font-bold text-gray-900">생년월일</Label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="h-12 text-lg border-x-0 border-t-0 border-b-2 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-karrot"
                                    required
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-base font-bold text-gray-900">보고 싶은 운세</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {topics.map((t) => (
                                        <div
                                            key={t.id}
                                            onClick={() => setTopic(t.id)}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all ${topic === t.id
                                                ? 'border-karrot bg-orange-50 ring-1 ring-orange-200'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{t.emoji}</div>
                                            <div className={`font-medium ${topic === t.id ? 'text-karrot' : 'text-gray-600'}`}>
                                                {t.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 animate-slide-up">
                        {/* Fortune Result Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                                {selectedTopic?.emoji}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {name}님의 <span className="text-karrot">{selectedTopic?.label}</span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    2026년 운세를 분석했어요
                                </p>
                            </div>
                        </div>

                        {/* Luck Temperature */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-900">운세 온도</span>
                                <span className="text-lg font-bold text-karrot">{temperature.toFixed(1)}°C</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-karrot transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(temperature, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-right">
                                {temperature > 50 ? '따뜻한 한 해가 될 거예요! 🔥' : '차분하게 준비하는 한 해 😌'}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {!fortune && isLoading && (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-karrot" />
                                    <p>열심히 운세를 읽고 있어요...</p>
                                </div>
                            )}

                            {fortune && (
                                <div className="prose prose-gray max-w-none">
                                    {fortune.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-gray-800 leading-7 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer / Action Button */}
            {!showFortune ? (
                <div className="fixed bottom-0 w-full max-w-[600px] p-4 bg-white border-t border-gray-100 space-y-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={!name || !birthDate || !topic}
                        className="w-full bg-karrot hover:bg-karrot text-white font-bold text-lg h-14 rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                    >
                        운세 확인하기
                    </Button>
                    <Link href="/history" className="block">
                        <Button
                            variant="outline"
                            className="w-full h-12 font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            내 운세 기록 보기
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="fixed bottom-0 w-full max-w-[600px] p-4 bg-white border-t border-gray-100 space-y-2">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowFortune(false);
                                setFortune('');
                                setTemperature(36.5);
                            }}
                            className="flex-1 h-14 font-bold border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            다시 하기
                        </Button>
                        <Button className="flex-[2] h-14 bg-karrot hover:bg-karrot text-white font-bold rounded-xl shadow-md">
                            공유하기
                        </Button>
                    </div>
                    <Link href="/history" className="block">
                        <Button
                            variant="outline"
                            className="w-full h-12 font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            내 운세 기록 보기
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
