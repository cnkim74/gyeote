import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Managers } from '@/components/home/Managers';

export const metadata = {
  title: '매니저 · 곁에',
  description: '전문 자격증을 보유한 곁에 매니저를 소개합니다. 요양보호사·간호조무사·사회복지사 자격을 갖춘 매니저가 어르신 곁에 함께합니다.',
};

export default function ManagersPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-20">
        <Managers />
      </main>
      <Footer />
    </div>
  );
}
