import { UserPersonalInfo } from '../PersonalInfo';

export type UserRequest = {
  email: string;
  password: string;
  personalInfo: UserPersonalInfo;
};