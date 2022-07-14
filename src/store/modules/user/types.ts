export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id?: number;
  name?: string;
  email?: string;
  email_verified_at?: any;
  created_at?: Date;
  updated_at?: Date;
  phone?: string;
  avatar?: any;
  nick_name?: any;
  cn_name?: any;
  gender?: number;
  qq?: any;
  address?: any;
  login_count?: number;
  login_error_count?: number;
  login_time?: string;
  login_ip?: string;
  status?: number;
  remarks?: any;
  role_id?: number;
  department_id?: any;
  is_admin?: number;
  login_notification?: number;
  phone_verified_at?: string;
  wx_openid?: any;
  qq_openid?: any;
  ios_openid?: any;
  device_hash?: any;
  open_comment?: number;
  invite_code?: any;
  deleted_at?: any;
  role?: RoleType;
}
