'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { HeroImage } from '@/types';

export default function ImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_images')
      .select('*')
      .order('sort_order');
    setImages(data ?? []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const supabase = createClient();
    const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.sort_order)) : -1;

    for (const [idx, file] of Array.from(files).entries()) {
      const path = `${Date.now()}-${idx}-${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from('hero-images').upload(path, file);

      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('hero-images').getPublicUrl(path);

        await supabase.from('hero_images').insert({
          storage_path: path,
          url: publicUrl,
          caption: '안동, 가을의 어느 오후',
          sort_order: maxOrder + 1 + idx,
          is_active: true,
        });
      }
    }

    setUploading(false);
    loadImages();
    if (fileRef.current) fileRef.current.value = '';
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from('hero_images').update({ is_active: !current }).eq('id', id);
    setImages(prev => prev.map(img => (img.id === id ? { ...img, is_active: !current } : img)));
  }

  async function handleDelete(id: string, storagePath: string | null) {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    if (storagePath) await supabase.storage.from('hero-images').remove([storagePath]);
    await supabase.from('hero_images').delete().eq('id', id);
    setImages(prev => prev.filter(img => img.id !== id));
  }

  async function updateCaption(id: string, caption: string) {
    const supabase = createClient();
    await supabase.from('hero_images').update({ caption }).eq('id', id);
  }

  async function reorder(index: number, dir: 'up' | 'down') {
    const swap = dir === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= images.length) return;

    const next = [...images];
    [next[index], next[swap]] = [next[swap], next[index]];
    setImages(next);

    const supabase = createClient();
    await Promise.all(
      next.map((img, i) =>
        supabase.from('hero_images').update({ sort_order: i }).eq('id', img.id)
      )
    );
  }

  const borderStyle = { border: '0.5px solid rgba(42,40,35,0.18)' };

  return (
    <div className="p-8 md:p-10 max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-serif-ko font-black text-ink text-[28px]">히어로 이미지</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-primary text-surface px-4 py-2 text-[13px] hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          <Upload size={14} strokeWidth={1.4} />
          {uploading ? '업로드 중...' : '이미지 추가'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <p className="text-[13px] text-mute mb-8">
        활성화된 이미지가 홈 화면 슬라이드에 표시됩니다. 순서를 조정하여 표시 순서를 변경하세요.
      </p>

      {loading ? (
        <p className="text-mute text-[14px]">불러오는 중...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={`bg-paper flex items-center gap-4 p-4 transition-opacity ${
                img.is_active ? '' : 'opacity-50'
              }`}
              style={borderStyle}
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-14 shrink-0 overflow-hidden bg-surface">
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Caption */}
              <div className="flex-1 min-w-0">
                <input
                  defaultValue={img.caption}
                  onBlur={e => updateCaption(img.id, e.target.value)}
                  className="w-full text-[13px] text-ink bg-transparent border-b border-transparent hover:border-line focus:border-primary focus:outline-none py-0.5 transition-colors"
                  placeholder="캡션 (예: 안동, 가을의 어느 오후)"
                />
                <p className="text-[11px] text-mute mt-1">
                  {img.is_active ? '활성' : '비활성'} · #{i + 1}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => reorder(i, 'up')}
                  disabled={i === 0}
                  className="p-1.5 text-mute hover:text-ink disabled:opacity-25 transition-colors"
                  title="위로"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  onClick={() => reorder(i, 'down')}
                  disabled={i === images.length - 1}
                  className="p-1.5 text-mute hover:text-ink disabled:opacity-25 transition-colors"
                  title="아래로"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  onClick={() => toggleActive(img.id, img.is_active)}
                  className="p-1.5 text-mute hover:text-ink transition-colors"
                  title={img.is_active ? '비활성화' : '활성화'}
                >
                  {img.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(img.id, img.storage_path)}
                  className="p-1.5 text-mute hover:text-accent transition-colors"
                  title="삭제"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="bg-paper p-12 text-center" style={borderStyle}>
              <p className="text-mute text-[14px] mb-4">등록된 이미지가 없습니다.</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-primary text-[13px] ulink"
              >
                첫 이미지를 추가하세요
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
