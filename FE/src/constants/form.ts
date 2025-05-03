export const ERROR_MESSAGES = {
  required: 'Trường này là bắt buộc',
  invalidEmail: 'Email không hợp lệ',
  passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
  passwordNoLowercase: 'Mật khẩu phải có ít nhất một chữ cái thường',
  passwordNoUppercase: 'Mật khẩu phải có ít nhất một chữ cái hoa',
  passwordNoSpecialChar: 'Mật khẩu phải có ít nhất một ký tự đặc biệt',
  invalidDate: 'Ngày sinh không hợp lệ',
  dateInFuture: 'Ngày sinh không được lớn hơn ngày hiện tại',
}

export const FORM_FIELDS = {
  lastName: 'Họ',
  firstName: 'Tên',
  email: 'Email',
  password: 'Mật khẩu',
  birthDate: 'Ngày sinh',
  gender: 'Giới tính',
}

export const GENDER_OPTIONS = [
  { label: 'Nam', value: 0 },
  { label: 'Nữ', value: 1 },
  { label: 'Khác', value: 2 },
]

export const DEFAULT_FORM_DATA = {
  lastName: '',
  firstName: '',
  email: '',
  password: '',
  birthDate: '',
  gender: 0,
}

