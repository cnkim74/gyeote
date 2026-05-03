import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/home/Hero';
import { Problem } from '@/components/home/Problem';
import { Solution } from '@/components/home/Solution';
import { KakaoDemo } from '@/components/home/KakaoDemo';
import { Pricing } from '@/components/home/Pricing';
import { Different } from '@/components/home/Different';
import { Managers } from '@/components/home/Managers';
import { Voices } from '@/components/home/Voices';
import { FAQ } from '@/components/home/FAQ';
import { CTA } from '@/components/home/CTA';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <KakaoDemo />
        <Pricing />
        <Different />
        <Managers />
        <Voices />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
