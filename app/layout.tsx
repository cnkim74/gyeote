import type { Metadata } from 'next';
import { Noto_Serif_KR, EB_Garamond } from 'next/font/google';
import './globals.css';

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '곁에 — 자녀를 대신해, 부모님 곁에.',
  description:
    '자녀를 대신해, 부모님 곁에. 매주 전화 너머의 "괜찮다"와 실제의 오늘 사이를 잇는 동행 구독.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
