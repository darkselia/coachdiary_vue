import type { Gender } from '@/types/common';

export type StandardLevel = {
  id: number;
  is_lower_better: boolean;
  level_number: number;
  low_value: number;
  middle_value: number;
  high_value: number;
  gender: Gender;
};

export type StandardResponse = {
  id: number;
  name: string;
  has_numeric_value: boolean;
  levels: StandardLevel[];
};

export type StandardLevelRequest = {
  is_lower_better: boolean;
  level_number: number;
  low_value: number | null;
  middle_value: number | null;
  high_value: number | null;
  gender: Gender;
};

export type StandardRequest = {
  name: string;
  has_numeric_value: boolean;
  levels: StandardLevelRequest[];
};

export type StandardFormPageType = 'create-standard' | 'update-standard';
export type StandardType = 'physical' | 'technical';
export type StandardEvaluationType = 'lower-is-better' | 'higher-is-better';

export type StandardFormLevelValues = {
  high: number | null;
  middle: number | null;
  low: number | null;
};

export type StandardFormLevel = {
  girls: StandardFormLevelValues;
  boys: StandardFormLevelValues;
};
