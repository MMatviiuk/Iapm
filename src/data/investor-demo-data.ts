/**
 * INVESTOR DEMO DATA - November 7, 2025
 * 
 * Comprehensive demo data to showcase the application to investors:
 * - 4 Dependents for demo caregiver (diverse ages, genders, medication schedules)
 * - 10 Patients for demo doctor (various conditions, medication complexity)
 * - Realistic European medications and schedules
 * - All 8 core medication forms represented
 */

import type { DemoPatient, DemoCaregiver, DemoDoctor, DemoDatabase } from '../utils/demoData';

// Demo Caregiver with 4 Dependents
export const DEMO_CAREGIVER: DemoCaregiver = {
  id: 'cg_demo_investor',
  firstName: 'Anna',
  lastName: 'Johnson',
  email: 'caregiver@demo.com',
  phoneNumber: '+44 20 7946 0123',
  photoUrl: 'https://images.unsplash.com/photo-1710452772856-57452a2a60a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGNhcmVnaXZlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzMTMzN3ww&ixlib=rb-4.1.0&q=80&w=400',
  relationship: 'Daughter',
  dependents: ['dep_001', 'dep_002', 'dep_003', 'dep_004']
};

// Demo Doctor with 10 Patients
export const DEMO_DOCTOR: DemoDoctor = {
  id: 'doc_demo_investor',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  email: 'doctor@demo.com',
  specialty: 'General Practice',
  licenseNumber: 'GMC-7654321',
  phoneNumber: '+44 20 7946 0958',
  photoUrl: 'https://images.unsplash.com/photo-1622475441980-0a422e04efdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  yearsOfExperience: 15,
  patients: ['pt_001', 'pt_002', 'pt_003', 'pt_004', 'pt_005', 'pt_006', 'pt_007', 'pt_008', 'pt_009', 'pt_010']
};

// 4 DEPENDENTS FOR CAREGIVER
export const DEMO_DEPENDENTS: DemoPatient[] = [
  // Dependent 1: Elderly Mother - Complex medication schedule
  {
    id: 'dep_001',
    firstName: 'Margaret',
    lastName: 'Williams',
    email: 'margaret.williams@demo.com',
    dateOfBirth: '1945-06-15', // 79 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd8a69714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '45 Baker Street',
      city: 'London',
      postcode: 'NW1 6XE',
      country: 'United Kingdom'
    },
    caregiverId: 'cg_demo_investor',
    medications: [
      {
        id: 'rx_dep001_001',
        name: 'Ramipril',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'before',
        startDate: '2020-03-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_002',
        name: 'Metformin',
        dosage: '500mg',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2019-05-15',
        duration: 'Lifetime',
        condition: 'Type 2 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_003',
        name: 'Aspirin',
        dosage: '75mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2020-01-20',
        duration: 'Lifetime',
        condition: 'Cardiovascular protection',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_004',
        name: 'Atorvastatin',
        dosage: '20mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'after',
        startDate: '2019-11-05',
        duration: 'Lifetime',
        condition: 'High cholesterol',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_005',
        name: 'Omeprazole',
        dosage: '20mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['07:30'],
        mealTiming: 'before',
        startDate: '2021-02-10',
        duration: 'Lifetime',
        condition: 'GERD',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_006',
        name: 'Vitamin D3',
        dosage: '2000 IU',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2022-09-01',
        duration: 'Lifetime',
        condition: 'Vitamin D deficiency',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_007',
        name: 'Calcium & Vitamin D',
        dosage: '600mg/400 IU',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2022-09-01',
        duration: 'Lifetime',
        condition: 'Osteoporosis prevention',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep001_008',
        name: 'Alendronic Acid',
        dosage: '70mg',
        form: 'Tablet',
        frequency: 'Once weekly',
        times: ['07:00'],
        mealTiming: 'before',
        daysOfWeek: ['Monday'],
        startDate: '2023-01-15',
        duration: '24 months',
        condition: 'Osteoporosis',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take on empty stomach, stay upright for 30 minutes'
      }
    ],
    adherenceRate: 96
  },

  // Dependent 2: Father-in-law - Moderate medication schedule
  {
    id: 'dep_002',
    firstName: 'Robert',
    lastName: 'Thompson',
    email: 'robert.thompson@demo.com',
    dateOfBirth: '1948-11-22', // 76 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1570825249508-1165536981ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZXVyb3BlYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI1Mjg2MzF8MA&ixlib=rb-4.1.0&q=80&w=400',
    address: {
      street: '78 Queens Road',
      city: 'Brighton',
      postcode: 'BN1 3XE',
      country: 'United Kingdom'
    },
    caregiverId: 'cg_demo_investor',
    medications: [
      {
        id: 'rx_dep002_001',
        name: 'Lisinopril',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2021-04-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep002_002',
        name: 'Warfarin',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['18:00'],
        mealTiming: 'any',
        startDate: '2022-06-15',
        duration: 'Lifetime',
        condition: 'Atrial fibrillation',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Regular INR monitoring required'
      },
      {
        id: 'rx_dep002_003',
        name: 'Tamsulosin',
        dosage: '0.4mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'after',
        startDate: '2023-03-01',
        duration: 'Lifetime',
        condition: 'Benign prostatic hyperplasia',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep002_004',
        name: 'Salbutamol Inhaler',
        dosage: '100mcg',
        form: 'Inhaler',
        frequency: 'As needed',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2020-09-10',
        duration: 'Lifetime',
        condition: 'Asthma',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: '1-2 puffs when needed, max 8 puffs/day'
      },
      {
        id: 'rx_dep002_005',
        name: 'Omega-3 Fish Oil',
        dosage: '1000mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-01-10',
        duration: 'Lifetime',
        condition: 'Heart health',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 91
  },

  // Dependent 3: Elderly Aunt - Simple medication schedule
  {
    id: 'dep_003',
    firstName: 'Dorothy',
    lastName: 'Clarke',
    email: 'dorothy.clarke@demo.com',
    dateOfBirth: '1952-02-08', // 72 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '23 High Street',
      city: 'Oxford',
      postcode: 'OX1 4AA',
      country: 'United Kingdom'
    },
    caregiverId: 'cg_demo_investor',
    medications: [
      {
        id: 'rx_dep003_001',
        name: 'Levothyroxine',
        dosage: '100mcg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['07:00'],
        mealTiming: 'before',
        startDate: '2018-05-20',
        duration: 'Lifetime',
        condition: 'Hypothyroidism',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take 30 minutes before breakfast'
      },
      {
        id: 'rx_dep003_002',
        name: 'Amlodipine',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2022-01-15',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep003_003',
        name: 'Multivitamin',
        dosage: '1 tablet',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-01-01',
        duration: 'Lifetime',
        condition: 'General health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep003_004',
        name: 'Glucosamine Sulfate',
        dosage: '1500mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Osteoarthritis',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 98
  },

  // Dependent 4: Uncle - Topical medications and injections
  {
    id: 'dep_004',
    firstName: 'George',
    lastName: 'Harrison',
    email: 'george.harrison@demo.com',
    dateOfBirth: '1955-09-30', // 69 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '56 Park Avenue',
      city: 'Manchester',
      postcode: 'M1 4BT',
      country: 'United Kingdom'
    },
    caregiverId: 'cg_demo_investor',
    medications: [
      {
        id: 'rx_dep004_001',
        name: 'Insulin Glargine',
        dosage: '20 units',
        form: 'Injection',
        frequency: 'Once daily',
        times: ['22:00'],
        mealTiming: 'any',
        startDate: '2021-08-10',
        duration: 'Lifetime',
        condition: 'Type 1 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Inject subcutaneously in abdomen or thigh'
      },
      {
        id: 'rx_dep004_002',
        name: 'Insulin Aspart',
        dosage: '8-12 units',
        form: 'Injection',
        frequency: 'Three times daily',
        times: ['08:00', '13:00', '19:00'],
        mealTiming: 'before',
        startDate: '2021-08-10',
        duration: 'Lifetime',
        condition: 'Type 1 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Inject 5-10 minutes before meals'
      },
      {
        id: 'rx_dep004_003',
        name: 'Metoprolol',
        dosage: '50mg',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2022-03-15',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_dep004_004',
        name: 'Hydrocortisone Cream',
        dosage: '1%',
        form: 'Cream/Ointment',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2024-01-10',
        duration: '2 weeks',
        condition: 'Eczema',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Apply thin layer to affected areas'
      },
      {
        id: 'rx_dep004_005',
        name: 'Pregabalin',
        dosage: '75mg',
        form: 'Capsule',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2023-05-01',
        duration: 'Lifetime',
        condition: 'Neuropathic pain',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 89
  }
];

// 10 PATIENTS FOR DOCTOR
export const DEMO_DOCTOR_PATIENTS: DemoPatient[] = [
  // Patient 1: Complex polypharmacy case
  {
    id: 'pt_001',
    firstName: 'Elizabeth',
    lastName: 'Montgomery',
    email: 'elizabeth.montgomery@demo.com',
    dateOfBirth: '1943-04-12', // 81 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '12 Churchill Road',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt001_001',
        name: 'Furosemide',
        dosage: '40mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Heart failure',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_002',
        name: 'Bisoprolol',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Heart failure',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_003',
        name: 'Ramipril',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Heart failure',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_004',
        name: 'Spironolactone',
        dosage: '25mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Heart failure',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_005',
        name: 'Atorvastatin',
        dosage: '40mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2019-03-10',
        duration: 'Lifetime',
        condition: 'High cholesterol',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_006',
        name: 'Warfarin',
        dosage: '3mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['18:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Atrial fibrillation',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_007',
        name: 'Digoxin',
        dosage: '125mcg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Atrial fibrillation',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt001_008',
        name: 'Pantoprazole',
        dosage: '40mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['07:30'],
        mealTiming: 'before',
        startDate: '2021-01-10',
        duration: 'Lifetime',
        condition: 'GERD',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 87
  },

  // Patient 2: Diabetes management
  {
    id: 'pt_002',
    firstName: 'Harold',
    lastName: 'Jenkins',
    email: 'harold.jenkins@demo.com',
    dateOfBirth: '1950-07-18', // 74 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1664101606938-e664f5852fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '45 Victoria Street',
      city: 'Birmingham',
      postcode: 'B1 1BB',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt002_001',
        name: 'Metformin',
        dosage: '1000mg',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2019-02-10',
        duration: 'Lifetime',
        condition: 'Type 2 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt002_002',
        name: 'Gliclazide',
        dosage: '80mg',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2020-05-15',
        duration: 'Lifetime',
        condition: 'Type 2 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt002_003',
        name: 'Empagliflozin',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2022-03-01',
        duration: 'Lifetime',
        condition: 'Type 2 Diabetes',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt002_004',
        name: 'Atorvastatin',
        dosage: '20mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2019-02-10',
        duration: 'Lifetime',
        condition: 'High cholesterol',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt002_005',
        name: 'Ramipril',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2019-02-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt002_006',
        name: 'Aspirin',
        dosage: '75mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2019-02-10',
        duration: 'Lifetime',
        condition: 'Cardiovascular protection',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 93
  },

  // Patient 3: Respiratory conditions
  {
    id: 'pt_003',
    firstName: 'Patricia',
    lastName: 'Davies',
    email: 'patricia.davies@demo.com',
    dateOfBirth: '1958-03-25', // 66 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd8a69714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '89 King Street',
      city: 'Liverpool',
      postcode: 'L1 1AA',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt003_001',
        name: 'Seretide Inhaler',
        dosage: '250/25mcg',
        form: 'Inhaler',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2021-01-15',
        duration: 'Lifetime',
        condition: 'Asthma',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: '2 puffs twice daily'
      },
      {
        id: 'rx_pt003_002',
        name: 'Salbutamol Inhaler',
        dosage: '100mcg',
        form: 'Inhaler',
        frequency: 'As needed',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2020-05-10',
        duration: 'Lifetime',
        condition: 'Asthma rescue',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: '1-2 puffs as needed for breathlessness'
      },
      {
        id: 'rx_pt003_003',
        name: 'Montelukast',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2022-06-01',
        duration: 'Lifetime',
        condition: 'Asthma',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt003_004',
        name: 'Cetirizine',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2023-03-01',
        duration: 'Lifetime',
        condition: 'Allergic rhinitis',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 95
  },

  // Patient 4: Thyroid and bone health
  {
    id: 'pt_004',
    firstName: 'William',
    lastName: 'Foster',
    email: 'william.foster@demo.com',
    dateOfBirth: '1954-11-08', // 70 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '34 Castle Street',
      city: 'Edinburgh',
      postcode: 'EH1 2DP',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt004_001',
        name: 'Levothyroxine',
        dosage: '125mcg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['07:00'],
        mealTiming: 'before',
        startDate: '2017-04-10',
        duration: 'Lifetime',
        condition: 'Hypothyroidism',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take 30-60 minutes before breakfast'
      },
      {
        id: 'rx_pt004_002',
        name: 'Alendronic Acid',
        dosage: '70mg',
        form: 'Tablet',
        frequency: 'Once weekly',
        times: ['07:00'],
        mealTiming: 'before',
        daysOfWeek: ['Sunday'],
        startDate: '2022-09-01',
        duration: '24 months',
        condition: 'Osteoporosis',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take on empty stomach, remain upright for 30 minutes'
      },
      {
        id: 'rx_pt004_003',
        name: 'Calcium & Vitamin D',
        dosage: '600mg/400 IU',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['12:00', '20:00'],
        mealTiming: 'with',
        startDate: '2022-09-01',
        duration: 'Lifetime',
        condition: 'Bone health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt004_004',
        name: 'Amlodipine',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2021-03-15',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 97
  },

  // Patient 5: Mental health medications
  {
    id: 'pt_005',
    firstName: 'Susan',
    lastName: 'Phillips',
    email: 'susan.phillips@demo.com',
    dateOfBirth: '1960-05-14', // 64 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '67 Market Street',
      city: 'Leeds',
      postcode: 'LS1 6DT',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt005_001',
        name: 'Sertraline',
        dosage: '100mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2022-01-10',
        duration: 'Lifetime',
        condition: 'Depression',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt005_002',
        name: 'Pregabalin',
        dosage: '150mg',
        form: 'Capsule',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2022-06-15',
        duration: 'Lifetime',
        condition: 'Generalized anxiety disorder',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt005_003',
        name: 'Mirtazapine',
        dosage: '15mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2023-02-01',
        duration: 'Lifetime',
        condition: 'Insomnia',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take 30 minutes before bedtime'
      },
      {
        id: 'rx_pt005_004',
        name: 'Vitamin B Complex',
        dosage: '1 tablet',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-01-01',
        duration: 'Lifetime',
        condition: 'General health',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 88
  },

  // Patient 6: Pain management
  {
    id: 'pt_006',
    firstName: 'James',
    lastName: 'Robertson',
    email: 'james.robertson@demo.com',
    dateOfBirth: '1956-09-03', // 68 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1664101606938-e664f5852fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '91 George Street',
      city: 'Glasgow',
      postcode: 'G1 1RD',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt006_001',
        name: 'Naproxen',
        dosage: '500mg',
        form: 'Tablet',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2023-01-15',
        duration: '3 months',
        condition: 'Osteoarthritis',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt006_002',
        name: 'Paracetamol',
        dosage: '1000mg',
        form: 'Tablet',
        frequency: 'Four times daily',
        times: ['08:00', '12:00', '16:00', '20:00'],
        mealTiming: 'any',
        startDate: '2023-01-15',
        duration: 'As needed',
        condition: 'Pain relief',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt006_003',
        name: 'Diclofenac Gel',
        dosage: '1%',
        form: 'Cream/Ointment',
        frequency: 'Three times daily',
        times: ['08:00', '14:00', '20:00'],
        mealTiming: 'any',
        startDate: '2023-03-01',
        duration: 'As needed',
        condition: 'Knee arthritis',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Apply to affected knee'
      },
      {
        id: 'rx_pt006_004',
        name: 'Glucosamine & Chondroitin',
        dosage: '1500mg/1200mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-01-15',
        duration: 'Lifetime',
        condition: 'Joint health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt006_005',
        name: 'Omeprazole',
        dosage: '20mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['07:30'],
        mealTiming: 'before',
        startDate: '2023-01-15',
        duration: 'Lifetime',
        condition: 'NSAID gastroprotection',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 90
  },

  // Patient 7: Cardiovascular conditions
  {
    id: 'pt_007',
    firstName: 'Mary',
    lastName: 'Turner',
    email: 'mary.turner@demo.com',
    dateOfBirth: '1951-01-20', // 73 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd8a69714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '23 Princess Street',
      city: 'Manchester',
      postcode: 'M1 4LB',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt007_001',
        name: 'Bisoprolol',
        dosage: '2.5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2021-05-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt007_002',
        name: 'Ramipril',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2021-05-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt007_003',
        name: 'Amlodipine',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2022-01-15',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt007_004',
        name: 'Atorvastatin',
        dosage: '40mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'any',
        startDate: '2021-05-10',
        duration: 'Lifetime',
        condition: 'High cholesterol',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt007_005',
        name: 'Aspirin',
        dosage: '75mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2021-05-10',
        duration: 'Lifetime',
        condition: 'Cardiovascular protection',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt007_006',
        name: 'Clopidogrel',
        dosage: '75mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2023-08-01',
        duration: '12 months',
        condition: 'Post-MI prophylaxis',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 94
  },

  // Patient 8: Gastrointestinal conditions
  {
    id: 'pt_008',
    firstName: 'Thomas',
    lastName: 'Baker',
    email: 'thomas.baker@demo.com',
    dateOfBirth: '1962-12-05', // 61 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '56 North Street',
      city: 'Bristol',
      postcode: 'BS1 3AR',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt008_001',
        name: 'Lansoprazole',
        dosage: '30mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['07:30'],
        mealTiming: 'before',
        startDate: '2022-03-10',
        duration: 'Lifetime',
        condition: 'GERD',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt008_002',
        name: 'Mesalazine',
        dosage: '800mg',
        form: 'Tablet',
        frequency: 'Three times daily',
        times: ['08:00', '13:00', '19:00'],
        mealTiming: 'with',
        startDate: '2020-06-15',
        duration: 'Lifetime',
        condition: 'Ulcerative colitis',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt008_003',
        name: 'Azathioprine',
        dosage: '100mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2021-01-10',
        duration: 'Lifetime',
        condition: 'Ulcerative colitis',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt008_004',
        name: 'Folic Acid',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2021-01-10',
        duration: 'Lifetime',
        condition: 'Supplement with azathioprine',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt008_005',
        name: 'Loperamide',
        dosage: '2mg',
        form: 'Capsule',
        frequency: 'As needed',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2022-01-01',
        duration: 'As needed',
        condition: 'Diarrhea control',
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take after each loose stool, max 8 capsules/day'
      }
    ],
    adherenceRate: 92
  },

  // Patient 9: Neurological conditions
  {
    id: 'pt_009',
    firstName: 'Barbara',
    lastName: 'Wilson',
    email: 'barbara.wilson@demo.com',
    dateOfBirth: '1953-08-17', // 71 yrs
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '78 Abbey Road',
      city: 'Cambridge',
      postcode: 'CB1 2JT',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt009_001',
        name: 'Levodopa/Carbidopa',
        dosage: '100/25mg',
        form: 'Tablet',
        frequency: 'Three times daily',
        times: ['08:00', '13:00', '19:00'],
        mealTiming: 'before',
        startDate: '2021-09-15',
        duration: 'Lifetime',
        condition: "Parkinson's disease",
        prescribedBy: 'Dr. Sarah Mitchell',
        instructions: 'Take 30 minutes before meals'
      },
      {
        id: 'rx_pt009_002',
        name: 'Pramipexole',
        dosage: '0.5mg',
        form: 'Tablet',
        frequency: 'Three times daily',
        times: ['08:00', '13:00', '19:00'],
        mealTiming: 'with',
        startDate: '2022-01-10',
        duration: 'Lifetime',
        condition: "Parkinson's disease",
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt009_003',
        name: 'Rasagiline',
        dosage: '1mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2022-06-01',
        duration: 'Lifetime',
        condition: "Parkinson's disease",
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt009_004',
        name: 'Domperidone',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Three times daily',
        times: ['07:30', '12:30', '18:30'],
        mealTiming: 'before',
        startDate: '2021-09-15',
        duration: 'Lifetime',
        condition: 'Nausea control',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt009_005',
        name: 'Lactulose',
        dosage: '15ml',
        form: 'Liquid/Syrup',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'any',
        startDate: '2022-03-01',
        duration: 'Lifetime',
        condition: 'Constipation',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 86
  },

  // Patient 10: Nutritional supplements focus
  {
    id: 'pt_010',
    firstName: 'Richard',
    lastName: 'Evans',
    email: 'richard.evans@demo.com',
    dateOfBirth: '1959-04-28', // 65 yrs
    gender: 'male',
    photoUrl: 'https://images.unsplash.com/photo-1664101606938-e664f5852fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    address: {
      street: '34 Union Street',
      city: 'Newcastle',
      postcode: 'NE1 3AY',
      country: 'United Kingdom'
    },
    primaryDoctorId: 'doc_demo_investor',
    medications: [
      {
        id: 'rx_pt010_001',
        name: 'Amlodipine',
        dosage: '5mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'any',
        startDate: '2023-01-10',
        duration: 'Lifetime',
        condition: 'Hypertension',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_002',
        name: 'Vitamin D3',
        dosage: '2000 IU',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Vitamin D deficiency',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_003',
        name: 'Omega-3 Fish Oil',
        dosage: '1000mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Heart health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_004',
        name: 'Magnesium Citrate',
        dosage: '200mg',
        form: 'Tablet',
        frequency: 'Once daily',
        times: ['20:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Muscle health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_005',
        name: 'Coenzyme Q10',
        dosage: '100mg',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Energy and heart health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_006',
        name: 'Probiotic Complex',
        dosage: '10 billion CFU',
        form: 'Capsule',
        frequency: 'Once daily',
        times: ['08:00'],
        mealTiming: 'before',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Gut health',
        prescribedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'rx_pt010_007',
        name: 'Turmeric Extract',
        dosage: '500mg',
        form: 'Capsule',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        mealTiming: 'with',
        startDate: '2023-06-01',
        duration: 'Lifetime',
        condition: 'Joint health',
        prescribedBy: 'Dr. Sarah Mitchell'
      }
    ],
    adherenceRate: 96
  }
];

// Simple demo patient for patient@demo.com
const SIMPLE_DEMO_PATIENT: DemoPatient = {
  id: 'simple_patient_001',
  firstName: 'John',
  lastName: 'Smith',
  email: 'patient@demo.com',
  dateOfBirth: '1955-03-15', // 69 yrs
  gender: 'male',
  photoUrl: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNDYxMzEzfDA&ixlib=rb-4.1.0&q=80&w=400',
  address: {
    street: '123 Main Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom'
  },
  medications: [
    // Morning medications (7:00-9:00)
    {
      id: 'rx_simple_001',
      name: 'Omeprazole',
      dosage: '20mg',
      form: 'Capsule',
      frequency: 'Once daily',
      times: ['07:30'],
      mealTiming: 'before',
      startDate: '2023-01-10',
      duration: 'Lifetime',
      condition: 'GERD',
      prescribedBy: 'Dr. James Anderson'
    },
    {
      id: 'rx_simple_002',
      name: 'Lisinopril',
      dosage: '10mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['08:00'],
      mealTiming: 'any',
      startDate: '2023-01-15',
      duration: 'Lifetime',
      condition: 'Hypertension',
      prescribedBy: 'Dr. Sarah Mitchell'
    },
    {
      id: 'rx_simple_003',
      name: 'Metformin',
      dosage: '500mg',
      form: 'Tablet',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      mealTiming: 'with',
      startDate: '2023-02-05',
      duration: 'Lifetime',
      condition: 'Type 2 Diabetes',
      prescribedBy: 'Dr. Emma Murphy'
    },
    {
      id: 'rx_simple_004',
      name: 'Aspirin',
      dosage: '75mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['08:00'],
      mealTiming: 'with',
      startDate: '2023-01-20',
      duration: 'Lifetime',
      condition: 'Cardiovascular protection',
      prescribedBy: 'Dr. Sarah Mitchell'
    },
    // Midday medications (12:00-14:00)
    {
      id: 'rx_simple_005',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      form: 'Capsule',
      frequency: 'Once daily',
      times: ['12:00'],
      mealTiming: 'with',
      startDate: '2023-03-01',
      duration: 'Lifetime',
      condition: 'Vitamin D deficiency',
      prescribedBy: 'Dr. Klaus Schmidt'
    },
    {
      id: 'rx_simple_006',
      name: 'Calcium Carbonate',
      dosage: '600mg',
      form: 'Tablet',
      frequency: 'Twice daily',
      times: ['12:00', '19:00'],
      mealTiming: 'with',
      startDate: '2023-03-01',
      duration: 'Lifetime',
      condition: 'Bone health',
      prescribedBy: 'Dr. Klaus Schmidt'
    },
    // Afternoon medications (15:00-17:00)
    {
      id: 'rx_simple_007',
      name: 'Amlodipine',
      dosage: '5mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['16:00'],
      mealTiming: 'any',
      startDate: '2023-04-10',
      duration: 'Lifetime',
      condition: 'Hypertension',
      prescribedBy: 'Dr. Carlos Rodriguez'
    },
    // Evening medications (18:00-20:00)
    {
      id: 'rx_simple_008',
      name: 'Atorvastatin',
      dosage: '20mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['19:00'],
      mealTiming: 'after',
      startDate: '2023-02-15',
      duration: 'Lifetime',
      condition: 'High cholesterol',
      prescribedBy: 'Dr. James Anderson'
    },
    {
      id: 'rx_simple_009',
      name: 'Simvastatin',
      dosage: '20mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['20:00'],
      mealTiming: 'with',
      startDate: '2023-02-01',
      duration: 'Lifetime',
      condition: 'High Cholesterol',
      prescribedBy: 'Dr. Sarah Mitchell'
    },
    // Night medications (21:00-22:00)
    {
      id: 'rx_simple_010',
      name: 'Melatonin',
      dosage: '3mg',
      form: 'Tablet',
      frequency: 'Once daily',
      times: ['21:30'],
      mealTiming: 'any',
      startDate: '2023-05-01',
      duration: 'Lifetime',
      condition: 'Sleep support',
      prescribedBy: 'Dr. Emma Murphy',
      instructions: 'Take 30 minutes before bedtime'
    }
  ],
  adherenceRate: 92
};

// Complete investor demo database
export const INVESTOR_DEMO_DATABASE: DemoDatabase = {
  doctors: [DEMO_DOCTOR],
  caregivers: [DEMO_CAREGIVER],
  patients: [SIMPLE_DEMO_PATIENT, ...DEMO_DEPENDENTS, ...DEMO_DOCTOR_PATIENTS]
};

// Summary statistics for investor presentation
export const INVESTOR_DEMO_STATS = {
  caregiver: {
    totalDependents: 4,
    totalMedications: DEMO_DEPENDENTS.reduce((sum, dep) => sum + dep.medications.length, 0),
    averageAdherence: Math.round(
      DEMO_DEPENDENTS.reduce((sum, dep) => sum + (dep.adherenceRate || 0), 0) / DEMO_DEPENDENTS.length
    ),
    ageRange: {
      youngest: 69,
      oldest: 79
    }
  },
  doctor: {
    totalPatients: 10,
    totalMedications: DEMO_DOCTOR_PATIENTS.reduce((sum, pt) => sum + pt.medications.length, 0),
    averageAdherence: Math.round(
      DEMO_DOCTOR_PATIENTS.reduce((sum, pt) => sum + (pt.adherenceRate || 0), 0) / DEMO_DOCTOR_PATIENTS.length
    ),
    atRiskPatients: DEMO_DOCTOR_PATIENTS.filter(pt => (pt.adherenceRate || 0) < 90).length,
    ageRange: {
      youngest: 61,
      oldest: 81
    },
    conditionsDiversity: [
      'Heart failure',
      'Diabetes',
      'Respiratory conditions',
      'Thyroid disorders',
      'Mental health',
      'Pain management',
      'Cardiovascular disease',
      'Gastrointestinal disorders',
      "Parkinson's disease",
      'Nutritional health'
    ]
  },
  medicationFormsCovered: [
    'Tablet',
    'Capsule',
    'Liquid/Syrup',
    'Injection',
    'Cream/Ointment',
    'Inhaler'
  ]
};
