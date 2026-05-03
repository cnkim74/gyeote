import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MOOD_KO = { good: '좋음', fair: '보통', concern: '관심 필요' };

export async function POST(req: NextRequest) {
  const { keywords, mood, conditionScore, stressScore, beneficiaryName } = await req.json();

  if (!keywords?.trim()) {
    return NextResponse.json({ error: '키워드를 입력해 주세요.' }, { status: 400 });
  }

  const context = [
    `대상자: ${beneficiaryName ?? '어르신'}`,
    `안부 상태: ${MOOD_KO[mood as keyof typeof MOOD_KO] ?? mood}`,
    conditionScore ? `건강 상태 점수: ${conditionScore}/10` : null,
    stressScore ? `스트레스 지수: ${stressScore}/10` : null,
  ].filter(Boolean).join(' / ');

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: '당신은 노인 돌봄 방문 매니저가 방문 일지를 작성하도록 돕는 보조 도구입니다. 항상 한국어로 답변하세요.',
        },
        {
          role: 'user',
          content: `아래 정보를 바탕으로 방문 일지를 자연스럽고 따뜻한 문체로 작성해 주세요.

[방문 정보]
${context}

[매니저 메모/키워드]
${keywords}

[작성 지침]
- 2~4문단, 200~350자 분량
- 어르신을 존중하는 따뜻한 어조
- 구체적인 관찰 내용 포함 (식사, 건강, 대화, 활동 등)
- 특이사항이나 다음 방문 시 유의할 점으로 마무리
- 제목 없이 본문만 작성`,
        },
      ],
    });

    const text = completion.choices[0].message.content ?? '';
    return NextResponse.json({ draft: text });
  } catch (e: any) {
    console.error('Groq error:', e);
    return NextResponse.json({ error: e?.message ?? 'AI 오류가 발생했습니다.' }, { status: 500 });
  }
}
