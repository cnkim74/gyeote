'use client';

import { useEffect, useRef, useState } from 'react';
import { Navigation, ExternalLink, MapPin } from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  name: string | null;
  address: string | null;
  addressDetail?: string | null;
}

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export function KakaoMap({ name, address, addressDetail }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  // 지오코딩은 도로명 주소만 사용 (동호수 포함 시 검색 실패)
  const geocodeAddress = address ?? '';
  const fullAddress = addressDetail ? `${address} ${addressDetail}` : (address ?? '');
  const encodedAddress = encodeURIComponent(geocodeAddress);
  const encodedName = encodeURIComponent(name ?? '방문지');

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

  useEffect(() => {
    if (!address) return;

    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) { setError('NEXT_PUBLIC_KAKAO_MAP_KEY 환경변수가 없습니다.'); return; }

    function initMap() {
      if (!mapRef.current || !window.kakao?.maps) return;
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(fullAddress, (result: any[], status: string) => {
        if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
          setError('주소를 찾을 수 없습니다.');
          return;
        }
        const { x: lng, y: lat } = result[0];
        const coords = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: coords,
          level: 4,
        });
        new window.kakao.maps.Marker({ position: coords, map });
        setLoaded(true);
      });
    }

    // 이미 로드됐으면 바로 실행
    if (window.kakao?.maps?.services) {
      initMap();
      return;
    }

    const scriptId = 'kakao-maps-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
      script.onload = () => window.kakao.maps.load(initMap);
      script.onerror = () => setError('카카오맵 스크립트 로드에 실패했습니다.');
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(initMap);
    }
  }, [address, fullAddress]);

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

  return (
    <div className="bg-paper" style={border}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2"
        style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
        <MapPin size={13} strokeWidth={1.4} className="text-mute" />
        <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">방문지 위치</p>
      </div>

      {/* Map */}
      <div className="relative w-full bg-surface" style={{ height: '220px' }}>
        <div ref={mapRef} className="w-full h-full" />
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <p className="text-[12px] text-mute">지도 로딩 중...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface px-4">
            <p className="text-[12px] text-mute text-center">{error}</p>
          </div>
        )}
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
