export const ERROR_MESSAGES = {
  required: 'Trường này là bắt buộc',
  invalidEmail: 'Email không hợp lệ',
  invalidDate: 'Ngày sinh không hợp lệ',
  passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
  passwordTooLong: 'Mật khẩu không được quá 16 ký tự',
  passwordNoLowercase: 'Mật khẩu phải có ít nhất một chữ cái thường',
  passwordNoUppercase: 'Mật khẩu phải có ít nhất một chữ cái hoa',
  passwordNoSpecialChar: 'Mật khẩu phải có ít nhất một ký tự đặc biệt',
  passwordNotMath: 'Mật khẩu xác nhận không khớp',
  dateInFuture: 'Ngày sinh không được lớn hơn ngày hiện tại',
  lastNameTooLong: 'Họ không được quá 50 ký tự',
  lastNameTooShort: 'Họ phải có ít nhất một ký tự',
  firstNameTooLong: 'Tên không được quá 50 ký tự',
  firtNameTooShort: 'Tên phải có ít nhất một ký tự',
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

export const EMPTY_FORM_DATA = {
  password: '',
  confirmPassword: '',
}
