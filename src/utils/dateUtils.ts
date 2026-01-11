/**
 * Обчислює вік за датою народження
 * @param dateOfBirth - рядок дати у форматі YYYY-MM-DD
 * @returns Вік у роках
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Коригуємо, якщо день народження ще не настав
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Перевіряє дату народження
 * @param dateOfBirth - рядок дати у форматі YYYY-MM-DD
 * @returns Повідомлення про помилку або null
 */
export function validateDateOfBirth(dateOfBirth: string): string | null {
  if (!dateOfBirth) {
    return 'Вкажіть дату народження';
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  // Перевірка валідності дати
  if (isNaN(birthDate.getTime())) {
    return 'Вкажіть коректну дату';
  }
  
  // Перевірка, що дата не в майбутньому
  if (birthDate > today) {
    return 'Дата народження не може бути в майбутньому';
  }
  
  // Перевірка діапазону віку (1-120 років)
  const age = calculateAge(dateOfBirth);
  if (age < 1) {
    return 'Вік має бути не менше 1 року';
  }
  if (age > 120) {
    return 'Вкажіть коректну дату народження';
  }
  
  return null;
}

/**
 * Максимальна дата для поля (сьогодні)
 * @returns Рядок дати у форматі YYYY-MM-DD
 */
export function getMaxDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Мінімальна дата (120 років тому)
 * @returns Рядок дати у форматі YYYY-MM-DD
 */
export function getMinDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 120);
  return date.toISOString().split('T')[0];
}
