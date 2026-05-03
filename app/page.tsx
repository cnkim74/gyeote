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
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin')   redirect('/admin');
    if (profile?.role === 'manager') redirect('/manager');
    if (profile?.role === 'paying')  redirect('/dashboard');
    if (profile?.role === 'general') redirect('/mypage');
  }

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
