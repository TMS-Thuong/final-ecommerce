export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IGoogleUser {
  birthDate: Date;
  email: string;
  name: string;
  picture: string;
  uid: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IGoogleUser {
  email: string;
  name: string;
  picture: string;
  uid: string;
}

export type UserData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: number;
};

export interface SaveEmailVerificationTokenParams {
  userId: number;
  token: string;
  expiresAt: Date;
}

export interface GoogleAuthResponse {
  status: string;
  accesstoken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  code?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
}
