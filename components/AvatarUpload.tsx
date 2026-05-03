'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from './Avatar';

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
  name?: string | null;
  size?: number;
  onUpload?: (url: string) => void;
}

export function AvatarUpload({ userId, currentUrl, name, size = 80, onUpload }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('5MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }

    setError('');
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (upErr) {
      setError('업로드 실패: ' + upErr.message);
      setPreview(null);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);

    // Cache-bust
    const url = `${publicUrl}?t=${Date.now()}`;

    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId);

    setUploading(false);
    onUpload?.(url);
    if (fileRef.current) fileRef.current.value = '';
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative cursor-pointer group"
        onClick={() => !uploading && fileRef.current?.click()}
        style={{ width: size, height: size }}
      >
        <Avatar src={displayUrl} name={name} size={size} />

        {/* Overlay */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity"
          style={{ background: 'rgba(0,0,0,0.35)', opacity: uploading ? 1 : 0 }}
        >
          {uploading
            ? <Loader2 size={size * 0.3} className="text-white animate-spin" />
            : null
          }
        </div>
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <Camera size={size * 0.28} color="white" strokeWidth={1.4} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="text-[12px] text-primary hover:text-primary-deep transition-colors disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '사진 변경'}
      </button>

      {error && <p className="text-[11px] text-accent text-center">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
