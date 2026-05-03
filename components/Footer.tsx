import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="py-16 bg-ink text-surface/80">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Wordmark size={28} color="#F5EFE3" />
          <p className="mt-6 font-serif-ko text-[15px] leading-[1.85] text-surface/75 max-w-[360px]">
            자녀를 대신해, 부모님 곁에.
            <br />
            오늘도 곁에 다녀왔습니다.
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="text-[11.5px] tracking-[0.2em] uppercase font-en text-surface/50 mb-4">
            Office
          </div>
          <p className="text-[13.5px] leading-[1.85]">
            경상북도 안동시 단원로 00-0
            <br />
            곁에 안동 본점
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="text-[11.5px] tracking-[0.2em] uppercase font-en text-surface/50 mb-4">
            Contact
          </div>
          <p className="text-[13.5px] leading-[1.85]">
            054-000-0000
            <br />
            평일 09–18시
            <br />
            hello@gyeote.kr
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="text-[11.5px] tracking-[0.2em] uppercase font-en text-surface/50 mb-4">
            Legal
          </div>
          <ul className="text-[13.5px] leading-[1.95] space-y-1">
            <li>
              <a href="#" className="hover:text-surface">
                이용약관
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-surface">
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-surface">
                사업자 정보
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-page mx-auto px-6 md:px-10 mt-14 pt-6 border-t border-surface/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11.5px] text-surface/50">
        <span>© 2026 곁에 (Gyeote). 사업자등록번호 000-00-00000</span>
        <span className="font-en italic">Made in Andong, Korea.</span>
      </div>
    </footer>
  );
}
