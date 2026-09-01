import { apiDelete, apiGet, apiPost } from '@/api/http';
import type { ClassResponse } from '@/types/class';

export function getClasses(): Promise<ClassResponse[]> {
  return apiGet<ClassResponse[]>('/api/classes/');
}

export function deleteClassById(classId: number): Promise<void> {
  return apiDelete(`/api/classes/${classId}/`);
}

export function promoteClasses(): Promise<void> {
  return apiPost('/api/classes/promote/');
}
