'use client';

import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';

interface Props {
  userId: string;
  currentUrl: string | null;
  name: string | null;
  size?: number;
}

export function AvatarUploadWrapper({ userId, currentUrl, name, size = 80 }: Props) {
  const [url, setUrl] = useState(currentUrl);
  return (
    <AvatarUpload
      userId={userId}
      currentUrl={url}
      name={name}
      size={size}
      onUpload={setUrl}
    />
  );
}
