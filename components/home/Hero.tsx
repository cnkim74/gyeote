import { createClient } from '@/lib/supabase/server';
import { HeroSlideshow } from './HeroSlideshow';

const FALLBACK = [
  {
    id: 'fallback',
    url: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=1200&q=80',
    caption: '안동, 가을의 어느 오후',
  },
];

export async function Hero() {
  let images = FALLBACK;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_images')
      .select('id, url, caption')
      .eq('is_active', true)
      .order('sort_order');

    if (data && data.length > 0) {
      images = data;
    }
  } catch {}

  return <HeroSlideshow images={images} />;
}
