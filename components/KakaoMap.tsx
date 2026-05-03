'use client';

import { Navigation, ExternalLink, MapPin } from 'lucide-react';

interface KakaoMapProps {
  name: string | null;
  address: string | null;
  addressDetail?: string | null;
}

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export function KakaoMap({ name, address, addressDetail }: KakaoMapProps) {
  if (!address) {
    return (
      <div className="bg-paper p-5" style={border}>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={13} strokeWidth={1.4} className="text-mute" />
          <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">위치 정보</p>
        </div>
        <p className="text-[13px] text-mute">등록된 주소가 없습니다</p>
      </div>
    );
  }

  const fullAddress = addressDetail ? `${address} ${addressDetail}` : address;
  const encodedAddress = encodeURIComponent(address);
  const encodedFull = encodeURIComponent(fullAddress);
  const encodedName = encodeURIComponent(name ?? '방문지');

  const googleEmbedUrl = `https://maps.google.com/maps?q=${encodedFull}&output=embed&hl=ko`;
  const kakaoWebUrl = `https://map.kakao.com/?q=${encodedAddress}`;
  const naverUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
  const tmapUrl = `tmap://route?goalname=${encodedName}&goaladdr=${encodedAddress}`;
  const tmapWebUrl = `https://tmap.life/route?goalName=${encodedName}`;

  function openTmap() {
    const start = Date.now();
    window.location.href = tmapUrl;
    setTimeout(() => {
      if (Date.now() - start < 2000) window.open(tmapWebUrl, '_blank');
    }, 1500);
  }

  return (
    <div className="bg-paper" style={border}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2"
        style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
        <MapPin size={13} strokeWidth={1.4} className="text-mute" />
        <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">방문지 위치</p>
      </div>

      {/* Google Maps iframe */}
      <div style={{ height: '220px' }}>
        <iframe
          src={googleEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="방문지 지도"
        />
      </div>

      {/* Address */}
      <div className="px-5 py-4"
        style={{ borderTop: '0.5px solid rgba(42,40,35,0.12)', borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
        {name && <p className="font-serif-ko text-[15px] text-ink mb-0.5">{name}</p>}
        <p className="text-[13px] text-mute">{address}</p>
        {addressDetail && <p className="text-[12px] text-mute">{addressDetail}</p>}
      </div>

      {/* Navigation buttons */}
      <div className="px-5 py-4 flex gap-2 flex-wrap">
        <button
          onClick={openTmap}
          className="flex items-center gap-1.5 bg-[#1B6FE4] text-white px-4 py-2 text-[12.5px] hover:opacity-90 transition-opacity"
        >
          <Navigation size={13} strokeWidth={1.4} />
          티맵 길찾기
        </button>
        <a href={kakaoWebUrl} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 bg-[#FAE100] text-[#3C1E1E] px-4 py-2 text-[12.5px] hover:opacity-90 transition-opacity">
          <ExternalLink size={13} strokeWidth={1.4} />
          카카오맵
        </a>
        <a href={naverUrl} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 bg-[#03C75A] text-white px-4 py-2 text-[12.5px] hover:opacity-90 transition-opacity">
          <ExternalLink size={13} strokeWidth={1.4} />
          네이버지도
        </a>
      </div>
    </div>
  );
}
