export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email?: string;
  _id?: string;
}
