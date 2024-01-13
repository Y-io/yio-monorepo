export interface IUserAccount {
  username?: string;
  email?: string;
  phone?: number;
}

export interface UserProfile extends IUserAccount {
  id: string;
}
