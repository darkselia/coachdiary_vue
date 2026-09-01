export type LoginPageType = 'signIn' | 'signUp' | 'restore' | 'tokenSignUp' | 'reset-password';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegistrationRequest = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  invite_code: string;
};

export type InvitationResponse = {
  student: {
    first_name: string;
    last_name: string;
    patronymic: string;
  };
};

export type PasswordResetRequest = {
  email: string;
};

export type PasswordResetConfirmRequest = {
  token: string;
  new_password: string;
  confirm_password: string;
};
