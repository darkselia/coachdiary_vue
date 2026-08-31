import { apiGet, apiPost } from '@/api/http';
import type {
  InvitationResponse,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  LoginRequest,
  RegistrationRequest,
} from '@/types/auth';

export function signIn(data: LoginRequest): Promise<unknown> {
  return apiPost('/api/login/', data);
}

export function signUp(data: RegistrationRequest): Promise<unknown> {
  const url = data.invite_code ? '/api/create-user/from-invitation/' : '/api/create-user/';
  return apiPost(url, data);
}

export function getInvitation(token: string): Promise<InvitationResponse> {
  return apiGet<InvitationResponse>(`/api/create-user/from-invitation/${token}/`);
}

export function requestPasswordReset(data: PasswordResetRequest): Promise<unknown> {
  return apiPost('/api/email/reset-password/request_reset/', data);
}

export function confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<unknown> {
  return apiPost('/api/email/reset-password/confirm_reset/', data);
}

export function verifyEmail(token: string): Promise<unknown> {
  return apiGet(`/api/email/verify-email/${token}/`);
}

export function logout(): Promise<unknown> {
  return apiPost('/api/logout/');
}
