import { apiBlob, apiGet, apiPatch, apiPost } from '@/api/http';
import type {
  ChangeProfileDetailsRequest,
  ChangeProfileEmailRequest,
  ChangeProfilePasswordRequest,
  ExportReportParams,
  ImportProfileDataResponse,
  ProfileExportData,
  ProfileResponse,
} from '@/types/profile';

export function getProfile(): Promise<ProfileResponse> {
  return apiGet<ProfileResponse>('/api/profile/');
}

export function changeProfileDetails(data: ChangeProfileDetailsRequest): Promise<unknown> {
  return apiPatch('/api/profile/change_details/', data);
}

export function changeProfileEmail(data: ChangeProfileEmailRequest): Promise<unknown> {
  return apiPatch('/api/profile/change_email/', data);
}

export function changeProfilePassword(data: ChangeProfilePasswordRequest): Promise<unknown> {
  return apiPatch('/api/profile/change_password/', data);
}

export function exportProfileData(): Promise<ProfileExportData> {
  return apiGet<ProfileExportData>('/api/profile/export_data/');
}

export function exportProfileReport(params: ExportReportParams): Promise<Blob> {
  return apiBlob('/api/profile/export_xlsx/', params);
}

export function importProfileData(file: File): Promise<ImportProfileDataResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiPost<ImportProfileDataResponse>('/api/profile/import_data/', formData);
}

export function resendProfileVerificationEmail(): Promise<unknown> {
  return apiGet('/api/email/resend-confirmation/');
}
