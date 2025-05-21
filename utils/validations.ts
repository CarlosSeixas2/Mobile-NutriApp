export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return "Email é obrigatório";
  } else if (!emailRegex.test(email)) {
    return "Email inválido";
  }
  return "";
}

export function validatePassword(password: string) {
  if (!password.trim()) {
    return "Senha é obrigatória";
  } else if (password.length < 6) {
    return "Senha deve ter pelo menos 6 caracteres";
  }
  return "";
}

export function isValidPassword(password: string) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length > 6;

  return hasUppercase && hasSpecialChar && isLongEnough;
}

export function isValidPhone(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(month: number, year: number): number {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return 31;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return isLeapYear(year) ? 29 : 28;
  }
}

export function formatHeight(value: string) {
  const numericValue = value.replace(/\D/g, "");

  if (!numericValue) return "";

  if (numericValue.length === 1) return numericValue;

  return numericValue.slice(0, 1) + "." + numericValue.slice(1, 3);
}
