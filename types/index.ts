export type UserRole = 'general' | 'paying' | 'manager' | 'admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  general: '일반회원',
  paying: '결제회원',
  manager: '매니저',
  admin: '관리자',
};

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroImage {
  id: string;
  storage_path: string | null;
  url: string;
  caption: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
