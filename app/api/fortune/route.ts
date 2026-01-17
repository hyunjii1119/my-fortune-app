import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { name, birthDate, topic } = await req.json();

    // Validate inputs
    if (!name || !birthDate || !topic) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Map topics to Korean
    const topicMap: Record<string, string> = {
      'career': '커리어/진로',
      'wealth': '재물/금전운',
      'love': '연애/인간관계',
      'health': '건강',
      'study': '학업/성장',
      'overall': '종합운세'
    };

    const topicKorean = topicMap[topic] || topic;

    // Create personalized fortune prompt
    const prompt = `당신은 전문적이고 긍정적인 신년 운세 전문가입니다.

다음 정보를 바탕으로 2026년 신년 운세를 작성해주세요:
- 이름: ${name}님
- 생년월일: ${birthDate}
- 관심 주제: ${topicKorean}

요구사항:
1. 3-4개의 문단으로 구성
2. 구체적이고 실현 가능한 조언 포함
3. 긍정적이고 희망찬 톤 유지
4. ${name}님을 직접 호칭하며 개인화된 메시지 작성
5. 2026년 새해에 맞는 내용
6. ${topicKorean}에 초점을 맞춘 운세

운세를 작성해주세요:`;

    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.8,
    });

    // Create a text stream from the AI response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const textPart of result.textStream) {
            controller.enqueue(new TextEncoder().encode(textPart));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Fortune generation error:', error);
    return new Response('Error generating fortune', { status: 500 });
  }
}
