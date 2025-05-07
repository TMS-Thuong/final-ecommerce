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
