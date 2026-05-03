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

export interface VisitReport {
  id: string;
  manager_id: string | null;
  beneficiary_id: string;
  visit_date: string;
  summary: string;
  mood: 'good' | 'fair' | 'concern';
  photos: string[];
  created_at: string;
  manager?: { id: string; name: string | null } | null;
  beneficiary?: { id: string; name: string | null } | null;
}

export interface Subscription {
  id: string;
  payer_id: string;
  beneficiary_id: string | null;
  manager_id: string | null;
  plan: 'trial' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'paused' | 'cancelled';
  next_visit_date: string | null;
  next_billing_date: string | null;
  created_at: string;
  beneficiary?: Profile | null;
  manager?: Profile | null;
}

export const PLAN_LABELS: Record<string, string> = {
  trial: '30일 체험',
  basic: '베이직',
  standard: '스탠다드',
  premium: '프리미엄',
};

export const STATUS_LABELS: Record<string, string> = {
  active: '구독 중',
  paused: '일시정지',
  cancelled: '해지',
};

export const MOOD_LABELS: Record<string, string> = {
  good: '좋음',
  fair: '보통',
  concern: '관심필요',
};
