import { apiDelete, apiGet, apiPost, apiPut } from '@/api/http';
import type { StandardRequest, StandardResponse } from '@/types/standard';

export function getStandards(): Promise<StandardResponse[]> {
  return apiGet<StandardResponse[]>('/api/standards/');
}

export function getStandard(standardId: number): Promise<StandardResponse> {
  return apiGet<StandardResponse>(`/api/standards/${standardId}/`);
}

export function createStandard(data: StandardRequest): Promise<unknown> {
  return apiPost('/api/standards/', data);
}

export function updateStandard(standardId: number, data: StandardRequest): Promise<unknown> {
  return apiPut(`/api/standards/${standardId}/`, data);
}

export function deleteStandardById(standardId: number): Promise<void> {
  return apiDelete(`/api/standards/${standardId}/`);
}

export function removeStandardLevel(standardId: number, levelNumber: number): Promise<void> {
  return apiDelete(`/api/standards/${standardId}/remove_level/?level_number=${levelNumber}`);
}
