import { useState } from 'react';
import { toast } from 'sonner';

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  prescribed: string;
  refills: number;
  status: 'active' | 'expired';
}

interface PrescriptionFormData {
  name: string;
  quantity: string;
  dosageMg: string;
  timesPerDay: number;
  timeOfDay: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  mealTiming: string;
  morningTime: string;
  afternoonTime: string;
  eveningTime: string;
  daysOfWeek: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  durationNumber: string;
  unit: string;
  lifetime: boolean;
}

// Helper function to calculate time based on meal schedule and timing
const calculateTime = (timeOfDay: 'morning' | 'afternoon' | 'evening', mealTiming: string): string => {
  // Default meal times (patient's schedule reference)
  const mealSchedule = {
    morning: '08:00',   // Breakfast
    afternoon: '13:00', // Lunch
    evening: '19:00'    // Dinner
  };

  const baseTime = mealSchedule[timeOfDay];
  const [hours, minutes] = baseTime.split(':').map(Number);

  let adjustedHours = hours;
  let adjustedMinutes = minutes;

  if (mealTiming === 'before meal') {
    adjustedMinutes -= 30;
    if (adjustedMinutes < 0) {
      adjustedMinutes += 60;
      adjustedHours -= 1;
    }
  } else if (mealTiming === 'after meal') {
    adjustedMinutes += 30;
    if (adjustedMinutes >= 60) {
      adjustedMinutes -= 60;
      adjustedHours += 1;
    }
  }
  // 'with meal' or 'anytime' - use base time

  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
};

export function usePrescriptionManager() {
  const [editingPrescription, setEditingPrescription] = useState<{ id: string; rxId: number } | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState<string | null>(null);

  const defaultFormData: PrescriptionFormData = {
    name: '',
    quantity: '1',
    dosageMg: '500',
    timesPerDay: 1,
    timeOfDay: {
      morning: true,
      afternoon: false,
      evening: false
    },
    mealTiming: 'before meal',
    morningTime: calculateTime('morning', 'before meal'),
    afternoonTime: calculateTime('afternoon', 'before meal'),
    eveningTime: calculateTime('evening', 'before meal'),
    daysOfWeek: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true
    },
    durationNumber: '30',
    unit: 'Days',
    lifetime: false
  };

  const [formData, setFormData] = useState<PrescriptionFormData>(defaultFormData);

  // Start editing a prescription
  const startEdit = (entityId: string, rx: Prescription) => {
    setEditingPrescription({ id: entityId, rxId: rx.id });
    const mealTiming = 'before meal';
    setFormData({
      name: rx.medication,
      quantity: '1',
      dosageMg: rx.dosage.match(/\d+/)?.[0] || '500',
      timesPerDay: 1,
      timeOfDay: {
        morning: true,
        afternoon: false,
        evening: false
      },
      mealTiming: mealTiming,
      morningTime: calculateTime('morning', mealTiming),
      afternoonTime: calculateTime('afternoon', mealTiming),
      eveningTime: calculateTime('evening', mealTiming),
      daysOfWeek: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
      },
      durationNumber: '30',
      unit: 'Days',
      lifetime: false
    });
    setShowPrescriptionForm(entityId);
  };

  // Start adding a new prescription
  const startAdd = (entityId: string) => {
    setEditingPrescription(null);
    setFormData(defaultFormData);
    setShowPrescriptionForm(entityId);
  };

  // Cancel editing/adding
  const cancel = () => {
    setShowPrescriptionForm(null);
    setEditingPrescription(null);
    setFormData(defaultFormData);
  };

  // Build dosage string from form data
  const buildDosageString = (data: PrescriptionFormData): string => {
    const times: string[] = [];
    if (data.timeOfDay.morning) times.push(`morning (${data.morningTime})`);
    if (data.timeOfDay.afternoon) times.push(`afternoon (${data.afternoonTime})`);
    if (data.timeOfDay.evening) times.push(`evening (${data.eveningTime})`);
    
    const timeStr = times.length > 0 ? ` - ${times.join(', ')}` : '';
    return `${data.dosageMg}mg - ${data.quantity} tablet${data.quantity !== '1' ? 's' : ''} ${data.mealTiming}${timeStr}`;
  };

  // Add prescription
  const addPrescription = <T extends { id: string; prescriptions: Prescription[] }>(
    entityId: string,
    entities: T[],
    data: PrescriptionFormData
  ): T[] => {
    if (!data.name.trim()) {
      toast.error('Please fill in medication name');
      return entities;
    }

    const dosageString = buildDosageString(data);
    const newPrescription: Prescription = {
      id: Date.now(),
      medication: data.name,
      dosage: dosageString,
      prescribed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      refills: 0,
      status: 'active'
    };

    const updated = entities.map(entity =>
      entity.id === entityId
        ? { ...entity, prescriptions: [...entity.prescriptions, newPrescription] }
        : entity
    ) as T[];

    cancel();

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    toast.success('Prescription added successfully!', {
      description: `${data.name} has been prescribed`,
      duration: 3000,
    });

    return updated;
  };

  // Update prescription
  const updatePrescription = <T extends { id: string; prescriptions: Prescription[] }>(
    entityId: string,
    entities: T[],
    data: PrescriptionFormData
  ): T[] => {
    if (!data.name.trim() || !editingPrescription) {
      toast.error('Please fill in medication name');
      return entities;
    }

    const dosageString = buildDosageString(data);

    const updated = entities.map(entity =>
      entity.id === entityId
        ? {
            ...entity,
            prescriptions: entity.prescriptions.map(rx =>
              rx.id === editingPrescription.rxId
                ? {
                    ...rx,
                    medication: data.name,
                    dosage: dosageString,
                    refills: 0,
                    prescribed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  }
                : rx
            )
          }
        : entity
    ) as T[];

    cancel();

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    toast.success('Prescription updated successfully!', {
      description: `${data.name} has been updated`,
      duration: 3000,
    });

    return updated;
  };

  // Delete prescription
  const deletePrescription = <T extends { id: string; prescriptions: Prescription[] }>(
    entityId: string,
    rxId: number,
    entities: T[],
    medicationName: string
  ): T[] => {
    if (!confirm(`Are you sure you want to delete ${medicationName}?`)) {
      return entities;
    }

    const updated = entities.map(entity =>
      entity.id === entityId
        ? { ...entity, prescriptions: entity.prescriptions.filter(rx => rx.id !== rxId) }
        : entity
    ) as T[];

    toast.success(`${medicationName} removed`, { duration: 2000 });

    return updated;
  };

  return {
    editingPrescription,
    showPrescriptionForm,
    formData,
    setFormData,
    startEdit,
    startAdd,
    cancel,
    addPrescription,
    updatePrescription,
    deletePrescription
  };
}
