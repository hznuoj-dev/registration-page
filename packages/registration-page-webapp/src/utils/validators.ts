import validator from 'validator';

export function isValidUrl(url: string): boolean {
  /* eslint no-useless-escape:0 import/prefer-default-export:0 */
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(url);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 32;
}

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function stripInvalidCharactersInEmailVerificationCode(str: string) {
  return str.replace(/[^\d]/g, '');
}
