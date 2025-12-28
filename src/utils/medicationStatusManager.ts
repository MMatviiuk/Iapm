/**
 * MEDICATION STATUS MANAGER
 * Medical-grade lifecycle status system
 * Автоматично визначає статус на основі startDate та endDate
 */

export type MedicationStatus = 
  | 'SCHEDULED'   // Запланований (startDate у майбутньому)
  | 'ACTIVE'      // Активний (зараз між startDate та endDate)
  | 'COMPLETED'   // Завершений (endDate у минулому)
  | 'DELETED';    // Видалений (soft delete)

export interface MedicationWithStatus {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: MedicationStatus;
  deletedAt?: string;
}

/**
 * ACCEPTANCE CRITERIA (AC) для статусів:
 * 
 * 1. SCHEDULED:
 *    - startDate існує і знаходиться у майбутньому
 *    - Medication ще не почався
 *    - UI: Показати бейдж "Scheduled" (синій)
 *    - Action: Можна редагувати/видалити
 * 
 * 2. ACTIVE:
 *    - startDate відсутній АБО startDate <= today <= endDate
 *    - Medication приймається зараз
 *    - UI: Показати бейдж "Active" (зелений)
 *    - Action: Можна відмітити прийом, редагувати, видалити
 * 
 * 3. COMPLETED:
 *    - endDate існує і знаходиться у минулому
 *    - Курс прийому завершено
 *    - UI: Показати бейдж "Completed" (сірий)
 *    - Action: Тільки перегляд/видалення, НЕ можна відмітити прийом
 * 
 * 4. DELETED:
 *    - deletedAt встановлено
 *    - М'яке видалення (можна відновити)
 *    - UI: НЕ показувати у списках (тільки у корзині)
 *    - Action: Відновити або видалити назавжди
 */

/**
 * Розраховує статус medication на основі дат
 * @param medication - об'єкт medication з датами
 * @returns поточний статус
 */
export function calculateMedicationStatus(medication: MedicationWithStatus): MedicationStatus {
  // ПРІОРИТЕТ 1: Якщо видалений - статус DELETED
  if (medication.deletedAt || medication.status === 'DELETED') {
    return 'DELETED';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Порівнюємо тільки дати, без часу

  // Парсимо дати
  const startDate = medication.startDate ? new Date(medication.startDate) : null;
  const endDate = medication.endDate ? new Date(medication.endDate) : null;

  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }
  if (endDate) {
    endDate.setHours(0, 0, 0, 0);
  }

  // ЛОГІКА РОЗРАХУНКУ:

  // 1. Якщо є endDate і він у минулому → COMPLETED
  if (endDate && endDate < today) {
    return 'COMPLETED';
  }

  // 2. Якщо є startDate і він у майбутньому → SCHEDULED
  if (startDate && startDate > today) {
    return 'SCHEDULED';
  }

  // 3. У всіх інших випадках → ACTIVE
  // - startDate відсутній (lifetime medication)
  // - startDate <= today <= endDate (активний курс)
  // - startDate <= today і endDate відсутній (тривалий курс)
  return 'ACTIVE';
}

/**
 * Оновлює статус для масиву medications
 * @param medications - масив medications
 * @returns medications з оновленими статусами
 */
export function updateMedicationStatuses<T extends MedicationWithStatus>(
  medications: T[]
): T[] {
  return medications.map(med => ({
    ...med,
    status: calculateMedicationStatus(med),
  }));
}

/**
 * Фільтрує medications за статусом
 * @param medications - масив medications
 * @param statuses - масив статусів для фільтрації
 * @returns відфільтровані medications
 */
export function filterMedicationsByStatus<T extends MedicationWithStatus>(
  medications: T[],
  statuses: MedicationStatus[]
): T[] {
  return medications.filter(med => statuses.includes(med.status));
}

/**
 * Перевіряє чи можна відмітити прийом medication
 * @param medication - об'єкт medication
 * @returns true якщо можна відмітити прийом
 */
export function canMarkMedicationTaken(medication: MedicationWithStatus): boolean {
  const status = calculateMedicationStatus(medication);
  // Можна відмітити прийом тільки для ACTIVE medications
  return status === 'ACTIVE';
}

/**
 * Отримує колір бейджа для статусу
 * @param status - статус medication
 * @returns Tailwind класи для кольору
 */
export function getStatusBadgeColor(status: MedicationStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'SCHEDULED':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200',
        border: 'border-blue-300 dark:border-blue-700',
      };
    case 'ACTIVE':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-300 dark:border-green-700',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-800 dark:text-gray-300',
        border: 'border-gray-300 dark:border-gray-600',
      };
    case 'DELETED':
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-300 dark:border-red-700',
      };
  }
}

/**
 * Отримує текст для статусу (UK English)
 * @param status - статус medication
 * @returns текст для відображення
 */
export function getStatusLabel(status: MedicationStatus): string {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'ACTIVE':
      return 'Active';
    case 'COMPLETED':
      return 'Completed';
    case 'DELETED':
      return 'Deleted';
  }
}

/**
 * Отримує опис для статусу
 * @param status - статус medication
 * @returns детальний опис
 */
export function getStatusDescription(status: MedicationStatus): string {
  switch (status) {
    case 'SCHEDULED':
      return 'This medication is scheduled to start in the future';
    case 'ACTIVE':
      return 'This medication is currently active';
    case 'COMPLETED':
      return 'This medication course has been completed';
    case 'DELETED':
      return 'This medication has been deleted';
  }
}

/**
 * Визначає чи потрібно показувати medication у списку "Today"
 * @param medication - об'єкт medication
 * @returns true якщо потрібно показувати
 */
export function shouldShowInTodayList(medication: MedicationWithStatus): boolean {
  const status = calculateMedicationStatus(medication);
  // Показуємо тільки ACTIVE medications
  return status === 'ACTIVE';
}

/**
 * Визначає чи потрібно показувати medication у списку "All Medications"
 * @param medication - об'єкт medication
 * @returns true якщо потрібно показувати
 */
export function shouldShowInAllMedicationsList(medication: MedicationWithStatus): boolean {
  const status = calculateMedicationStatus(medication);
  // Показуємо всі, крім DELETED
  return status !== 'DELETED';
}

/**
 * Визначає чи потрібно показувати medication у History
 * @param medication - об'єкт medication
 * @returns true якщо потрібно показувати
 */
export function shouldShowInHistory(medication: MedicationWithStatus): boolean {
  const status = calculateMedicationStatus(medication);
  // Показуємо ACTIVE та COMPLETED, але не SCHEDULED і DELETED
  return status === 'ACTIVE' || status === 'COMPLETED';
}

/**
 * Отримує іконку для статусу (Lucide React)
 * @param status - статус medication
 * @returns назва іконки
 */
export function getStatusIcon(status: MedicationStatus): string {
  switch (status) {
    case 'SCHEDULED':
      return 'CalendarClock';
    case 'ACTIVE':
      return 'CheckCircle';
    case 'COMPLETED':
      return 'CheckCheck';
    case 'DELETED':
      return 'Trash2';
  }
}

/**
 * ПРИКЛАД ВИКОРИСТАННЯ:
 * 
 * ```tsx
 * import { 
 *   calculateMedicationStatus, 
 *   updateMedicationStatuses,
 *   getStatusBadgeColor,
 *   canMarkMedicationTaken 
 * } from '@/utils/medicationStatusManager';
 * 
 * // 1. Оновити статуси при завантаженні
 * const medications = await api.getMedications();
 * const medicationsWithStatus = updateMedicationStatuses(medications);
 * 
 * // 2. Показати бейдж статусу
 * const status = calculateMedicationStatus(medication);
 * const colors = getStatusBadgeColor(status);
 * 
 * <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
 *   {getStatusLabel(status)}
 * </Badge>
 * 
 * // 3. Перевірка перед відміткою прийому
 * if (!canMarkMedicationTaken(medication)) {
 *   toast.error('Cannot mark completed medication as taken');
 *   return;
 * }
 * ```
 */

/**
 * BACKEND INTEGRATION:
 * 
 * При створенні/оновленні medication:
 * 1. Frontend надсилає startDate, endDate
 * 2. Backend розраховує статус за допомогою calculateMedicationStatus()
 * 3. Backend зберігає статус у БД
 * 4. При GET запиті backend може перераховувати статус (опціонально)
 * 
 * При видаленні medication:
 * 1. Frontend викликає api.deleteMedication(id)
 * 2. Backend встановлює deletedAt = now() та status = 'DELETED'
 * 3. Medication залишається у БД (soft delete)
 * 
 * Корзина (майбутня функція):
 * 1. GET /medications?status=DELETED
 * 2. POST /medications/:id/restore → встановити deletedAt = null, перерахувати статус
 * 3. DELETE /medications/:id/permanently → видалити з БД назавжди
 */
