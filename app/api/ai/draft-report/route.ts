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
          content: `당신은 노인 돌봄 방문 매니저의 방문 일지 작성을 돕는 도구입니다.
반드시 지켜야 할 규칙:
1. 오직 한글(Korean)만 사용하세요. 한자, 영어, 아랍어, 기타 외국어 문자를 절대 사용하지 마세요.
2. 자연스러운 현대 한국어 구어체로 작성하세요.
3. 제목, 번호, 기호 없이 순수한 본문 문단만 작성하세요.`,
        },
        {
          role: 'user',
          content: `아래 정보를 바탕으로 방문 일지를 따뜻하고 자연스러운 한국어로 작성해 주세요.

[방문 정보]
${context}

[매니저 메모/키워드]
${keywords}

[작성 규칙]
- 2~3문단, 200~300자
- 한글만 사용 (한자 금지, 외래어 금지)
- 어르신을 존중하는 따뜻한 말투
- 식사·건강·대화·활동 등 구체적 내용 포함
- 마지막 문장은 다음 방문 시 유의할 점으로 마무리
- 제목 없이 본문만 출력`,
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
