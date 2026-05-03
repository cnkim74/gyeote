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
  address: string | null;
  address_detail: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberRequest {
  id: string;
  manager_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  address_detail: string | null;
  notes: string | null;
  avatar_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_profile_id: string | null;
  created_at: string;
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
  visit_time: string | null;
  summary: string;
  mood: 'good' | 'fair' | 'concern';
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  manager?: { id: string; name: string | null; phone?: string | null } | null;
  beneficiary?: { id: string; name: string | null; phone?: string | null; address?: string | null } | null;
}

export interface Payment {
  id: string;
  subscription_id: string;
  visit_report_id: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paid_at: string | null;
  created_at: string;
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
