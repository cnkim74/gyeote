import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Pricing } from '@/components/home/Pricing';
import { SpecialDay } from '@/components/home/SpecialDay';

export const metadata = {
  title: '요금 · 곁에',
  description: '곁에 구독 서비스 요금 안내. 안부·케어·깊이 세 가지 플랜과 특별한 날 1회 서비스를 확인하세요.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-20">
        <Pricing />
        <SpecialDay />
      </main>
      <Footer />
    </div>
  );
}
