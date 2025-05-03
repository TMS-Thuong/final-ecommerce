export type FormData = {
  lastName: string
  firstName: string
  email: string
  password: string
  birthDate: string
  gender: 0 | 1 | 2
}

export type LoginFormData = Pick<FormData, 'email' | 'password'>;
