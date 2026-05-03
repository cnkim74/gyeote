import { Quote } from 'lucide-react';
import { Reveal } from '../Reveal';

const quotes = [
  {
    body: '한 달에 한 번 가던 안동을, 이제 두 달에 한 번 갑니다. 미안한 마음이 줄지는 않지만, 어머니가 오늘 무엇을 드셨는지 알고 있다는 것만으로 잠을 더 잡니다.',
    who: '서울 거주 김OO 님 · 어머니 안동',
  },
  {
    body: '아버지께서 처음엔 “남이 왜 오느냐” 하셨는데, 세 번째 방문 후엔 매니저님 오시는 날을 손꼽아 기다리십니다. 사진 속 아버지 표정이 그걸 말해줍니다.',
    who: '판교 거주 이OO 님 · 아버지 의성',
  },
];

export function Voices() {
  return (
    <section className="py-24 md:py-36 hairline-t">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <div className="num text-primary text-[15px]">no. 08</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
            Voices
          </div>
        </div>
        <div className="md:col-span-9">
          <Reveal>
            <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em] max-w-[640px]">
              자녀들이 보내주신 말.
            </h2>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-12">
            {quotes.map((q, i) => (
              <Reveal key={q.who} delay={i * 120}>
                <figure className="hairline-t pt-8">
                  <Quote
                    size={20}
                    strokeWidth={1.4}
                    className="text-accent mb-4"
                  />
                  <blockquote className="font-serif-ko text-[18px] md:text-[20px] text-ink leading-[1.75]">
                    {q.body}
                  </blockquote>
                  <figcaption className="mt-6 text-[12.5px] text-mute">
                    — {q.who}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
