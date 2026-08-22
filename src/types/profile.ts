export type ProfilePageType = 'personal-info' | 'security' | 'data-reports';

export type ProfileResponse = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  email: string;
  is_email_verified: boolean;
};

export type ChangeProfileDetailsRequest = {
  first_name: string;
  last_name: string;
  patronymic: string;
};

export type ChangeProfileEmailRequest = {
  email: string;
};

export type ChangeProfilePasswordRequest = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

export type ExportReportParams = {
  include_norms: boolean;
  include_results: boolean;
  include_standards: boolean;
};

export type ProfileExportType = 'xlsx' | 'json';

export type ImportProfileDataResponse = {
  message: string;
};
