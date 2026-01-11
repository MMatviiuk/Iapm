/**
 * Smoke Tests - Швидка перевірка критичних функцій
 * Запуск: npm test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { loadDemoDatabase, initializeDemoUsers } from '../utils/demoData';

describe('🔥 Smoke Tests - Критичні Функції', () => {
  beforeEach(() => {
    // Очистити localStorage перед кожним тестом
    localStorage.clear();
  });

  it('✅ Демо база даних завантажується', async () => {
    const db = await loadDemoDatabase();

    expect(db).toBeDefined();
    expect(db.patients).toBeDefined();
    expect(db.caregivers).toBeDefined();
    expect(db.doctors).toBeDefined();

    // Перевірка що є хоча б один пацієнт
    expect(db.patients.length).toBeGreaterThan(0);

    console.log('✅ База даних:', {
      patients: db.patients.length,
      caregivers: db.caregivers.length,
      doctors: db.doctors.length
    });
  });

  it('✅ Демо користувачі ініціалізуються', async () => {
    await initializeDemoUsers();

    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');

    expect(users.length).toBeGreaterThan(0);

    // Перевірка що є demo@example.com
    const demoUser = users.find((u: any) => u.email === 'demo@example.com');
    expect(demoUser).toBeDefined();
    expect(demoUser?.role).toBe('patient');

    console.log('✅ Користувачів створено:', users.length);
  });

  it('✅ Медикаменти завантажуються для пацієнтів', async () => {
    const db = await loadDemoDatabase();

    const patientWithMeds = db.patients.find(p => p.medications && p.medications.length > 0);

    expect(patientWithMeds).toBeDefined();
    expect(patientWithMeds!.medications.length).toBeGreaterThan(0);

    console.log('✅ Медикаментів у пацієнта:', patientWithMeds!.medications.length);
  });

  it('✅ LocalStorage працює', () => {
    const testData = { test: 'value' };
    localStorage.setItem('test_key', JSON.stringify(testData));

    const retrieved = JSON.parse(localStorage.getItem('test_key') || '{}');

    expect(retrieved).toEqual(testData);

    console.log('✅ LocalStorage OK');
  });
});
