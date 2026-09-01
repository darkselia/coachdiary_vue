import type { Class } from '@/types/class';
import type { Gender, NullableGender } from '@/types/common';

export type StudentResponse = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  full_name: string;
  student_class: Class;
  birthday: string;
  gender: Gender;
  invitation_link: string;
  is_used_invitation: boolean;
};

export type StudentRequest = {
  first_name: string;
  last_name: string;
  patronymic: string;
  student_class: {
    number: number;
    class_name: string;
  };
  birthday: string;
  gender: Gender;
};

export type StudentStandardsResponse = {
  standards: StudentStandard[];
  summary_grade: number;
};

export type StudentStandardRequest = {
  student_id: number;
  standard_id: number;
  value: number | null;
  level_number: number;
};

export type StudentStandard = {
  standard: {
    id: number;
    name: string;
    has_numeric_value: boolean;
  };
  grade: number | null;
  value: number | null;
  level_number: number;
};

export type StudentStandardChange = {
  standard_id: number;
  level_number: number;
  value: number | null;
};

export type StudentResultDetail = {
  grade: number | null;
  value: number | null;
  standard_id: number;
};

export type StudentValueResponse = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  full_name: string;
  student_class: {
    number: number;
    class_name: string;
  };
  birthday: string;
  gender: Gender;
  standards_details: StudentResultDetail[];
  average_value: number | null;
  average_grade: number | null;
};

export type StudentValueRequest = {
  student_id: number;
  standard_id: number;
  value: number | null;
};

export type StudentFilters = {
  gender: NullableGender;
  grades: (number | null)[];
  birthYearFrom: number | null;
  birthYearUntil: number | null;
};

export type StudentFormPageType = 'create-student' | 'update-student';
