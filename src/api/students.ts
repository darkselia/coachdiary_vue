import { apiBlob, apiDelete, apiGet, apiPost, apiPut } from '@/api/http';
import type {
  StudentRequest,
  StudentResponse,
  StudentStandardRequest,
  StudentStandardsResponse,
  StudentValueResponse,
  StudentValueRequest,
} from '@/types/student';

export function getStudent(studentId: number): Promise<StudentResponse> {
  return apiGet<StudentResponse>(`/api/students/${studentId}/`);
}

export function getStudents(params?: Record<string, string | number | (string | number)[]>): Promise<
  StudentResponse[]
> {
  return apiGet<StudentResponse[]>('/api/students/', params);
}

export function createStudent(data: StudentRequest): Promise<unknown> {
  return apiPost('/api/students/', data);
}

export function updateStudent(studentId: number, data: StudentRequest): Promise<unknown> {
  return apiPut(`/api/students/${studentId}/`, data);
}

export function getStudentStandards(
  studentId: number,
  levelNumber: number,
): Promise<StudentStandardsResponse> {
  return apiGet<StudentStandardsResponse>(`/api/students/${studentId}/standards/`, {
    level_number: levelNumber,
  });
}

export function deleteStudentById(studentId: number): Promise<void> {
  return apiDelete(`/api/students/${studentId}/`);
}

export function saveStudentResults(data: StudentStandardRequest[]): Promise<unknown> {
  return apiPost('/api/students/results/create/', data);
}

export function saveStudentsValues(data: StudentValueRequest[]): Promise<unknown> {
  return apiPost('/api/students/results/create/', data);
}

export function getStudentsResults(
  classIds: number[],
  standardIds: number[],
): Promise<StudentValueResponse[]> {
  return apiGet<StudentValueResponse[]>('/api/students/results/list/', {
    'class_id[]': classIds,
    'standard_id[]': standardIds,
  });
}

export function getClassQRCodesPdf(classId: number): Promise<Blob> {
  return apiBlob('/api/students/generate_qr_codes_pdf/', { class_id: classId });
}
