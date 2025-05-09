export type RegisterDataType = {
  lastName: string
  firstName: string
  email: string
  password: string
  birthDate: string
  gender: 0 | 1 | 2
}

export type LoginDataType = Pick<RegisterDataType, 'email' | 'password'>
