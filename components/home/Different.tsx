import { Reveal } from '../Reveal';

const points = [
  {
    n: '01',
    head: '구독 모델',
    body: '횟수권 결제가 아닙니다. 매달 정해진 리듬으로 곁에를 두는 방식. 부모님은 “언제 또 오시느냐”를 묻지 않으셔도 됩니다.',
  },
  {
    n: '02',
    head: '리포트의 톤',
    body: '“정말 잘 지내십니다”가 아니라 “안색 좋으셨습니다”. 과장 없이 사실대로, 어른의 어조로. 모든 매니저가 같은 톤 가이드를 따릅니다.',
  },
  {
    n: '03',
    head: '지역 밀착',
    body: '안동·예천·영주·의성 등 7개 시·군에만 운영합니다. 매니저가 시장 상인을, 병원 간호사를 알고 있는 거리감.',
  },
];

export function Different() {
  return (
    <section className="py-24 md:py-36 hairline-t">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <div className="num text-primary text-[15px]">no. 06</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
            Why 곁에
          </div>
        </div>
        <div className="md:col-span-9">
          <Reveal>
            <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em] max-w-[720px]">
              방문 동행 서비스가 처음은 아닙니다.
              <br />
              <span className="text-primary">
                곁에는 세 가지가 다릅니다.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 space-y-0 hairline-t">
            {points.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="grid md:grid-cols-12 gap-6 py-8 md:py-10 hairline-b">
                  <div className="md:col-span-2">
                    <span className="num text-primary text-[28px]">{p.n}</span>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-serif-ko font-bold text-[22px] text-ink">
                      {p.head}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-[15.5px] text-ink/80 leading-[1.9] max-w-read">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
