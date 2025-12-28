// Auto-generated TypeScript database file
// This replaces complete-database.json to avoid build errors with JSON imports

import type { CompleteDatabase } from '../types';

export const databaseData: CompleteDatabase = {
  "doctors": [
    {
      "id": "doc_001",
      "firstName": "James",
      "lastName": "Anderson",
      "email": "j.anderson@medicalpractice.com",
      "specialty": "General Practice",
      "licenseNumber": "GMC-7654321",
      "phoneNumber": "+44 20 7946 0958",
      "photoUrl": "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "yearsOfExperience": 28,
      "patients": ["patient_001", "patient_002", "patient_003"]
    },
    {
      "id": "doc_002",
      "firstName": "Sarah",
      "lastName": "Mitchell",
      "email": "s.mitchell@endocrineclinic.com",
      "specialty": "Endocrinology",
      "licenseNumber": "GMC-8765432",
      "phoneNumber": "+44 20 7946 0959",
      "photoUrl": "https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "yearsOfExperience": 15,
      "patients": ["patient_001", "patient_004", "patient_005"]
    },
    {
      "id": "doc_003",
      "firstName": "Carlos",
      "lastName": "Rodriguez",
      "email": "c.rodriguez@rheumatology.com",
      "specialty": "Rheumatology",
      "licenseNumber": "GMC-9876543",
      "phoneNumber": "+34 91 555 1234",
      "photoUrl": "https://images.unsplash.com/photo-1758691462477-976f771224d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "yearsOfExperience": 22,
      "patients": ["patient_006", "patient_007", "patient_008"]
    },
    {
      "id": "doc_004",
      "firstName": "Emma",
      "lastName": "Murphy",
      "email": "e.murphy@cardiology.ie",
      "specialty": "Cardiology",
      "licenseNumber": "IMC-5432167",
      "phoneNumber": "+353 1 234 5678",
      "photoUrl": "https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "yearsOfExperience": 19,
      "patients": ["patient_009", "patient_010", "patient_011", "patient_012"]
    }
  ],
  "caregivers": [
    {
      "id": "cg_001",
      "firstName": "Catherine",
      "lastName": "Bennett",
      "email": "catherine.bennett@example.com",
      "phoneNumber": "+44 7700 900123",
      "photoUrl": "https://images.unsplash.com/photo-1599842058010-695bd1386b23?w=400",
      "relationship": "Daughter",
      "dependents": ["patient_001", "patient_004", "patient_007"]
    },
    {
      "id": "cg_002",
      "firstName": "Michael",
      "lastName": "O'Brien",
      "email": "michael.obrien@example.com",
      "phoneNumber": "+353 87 123 4567",
      "photoUrl": "https://images.unsplash.com/photo-1555097074-b16ec85d6b3e?w=400",
      "relationship": "Son",
      "dependents": ["patient_002", "patient_009"]
    },
    {
      "id": "cg_003",
      "firstName": "Martina",
      "lastName": "Rossi",
      "email": "martina.rossi@example.com",
      "phoneNumber": "+39 333 123 4567",
      "photoUrl": "https://images.unsplash.com/photo-1599842058010-695bd1386b23?w=400",
      "relationship": "Niece",
      "dependents": ["patient_003", "patient_006"]
    }
  ],
  "patients": [
    {
      "id": "patient_001",
      "firstName": "Anna",
      "lastName": "Williams",
      "email": "anna.williams@example.com",
      "dateOfBirth": "2015-03-15",
      "gender": "Female",
      "photoUrl": "https://images.unsplash.com/photo-1552543859-03d222be8d8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGdpcmwlMjBldXJvcGVhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzMjI0OHww&ixlib=rb-4.1.0&q=80&w=400",
      "address": {
        "street": "12 Oxford Street",
        "city": "London",
        "postcode": "W1D 1BS",
        "country": "United Kingdom"
      },
      "caregiverId": "cg_001",
      "primaryDoctorId": "doc_001",
      "medications": [
        {
          "id": "rx_001",
          "name": "Vitamin D3",
          "dosage": "400 IU",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "with",
          "startDate": "2023-01-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_001",
          "condition": "General health"
        }
      ],
      "adherenceRate": 95
    },
    {
      "id": "patient_002",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "dateOfBirth": "1951-07-22",
      "gender": "Male",
      "photoUrl": "https://images.unsplash.com/photo-1570825249508-1165536981ce?w=400",
      "address": {
        "street": "45 Grafton Street",
        "city": "Dublin",
        "postcode": "D02 V580",
        "country": "Ireland"
      },
      "caregiverId": "cg_002",
      "primaryDoctorId": "doc_001",
      "medications": [
        {
          "id": "rx_007",
          "name": "Metformin",
          "dosage": "1000mg",
          "frequency": "Twice daily",
          "times": ["08:00", "20:00"],
          "mealTiming": "with",
          "startDate": "2020-03-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_001",
          "condition": "Type 2 Diabetes"
        },
        {
          "id": "rx_008",
          "name": "Ramipril",
          "dosage": "5mg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "with",
          "startDate": "2020-03-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_001",
          "condition": "Hypertension"
        }
      ],
      "adherenceRate": 88
    },
    {
      "id": "patient_003",
      "firstName": "Sophie",
      "lastName": "Dubois",
      "email": "sophie.dubois@example.com",
      "dateOfBirth": "1955-11-08",
      "gender": "Female",
      "photoUrl": "https://images.unsplash.com/photo-1525599428495-0441bd5c67de?w=400",
      "address": {
        "street": "28 Rue de Rivoli",
        "city": "Paris",
        "postcode": "75004",
        "country": "France"
      },
      "caregiverId": "cg_003",
      "primaryDoctorId": "doc_001",
      "medications": [
        {
          "id": "rx_013",
          "name": "Omeprazole",
          "dosage": "20mg",
          "frequency": "Once daily",
          "times": ["07:30"],
          "mealTiming": "before",
          "startDate": "2022-08-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_001",
          "condition": "GERD"
        },
        {
          "id": "rx_014",
          "name": "Amlodipine",
          "dosage": "5mg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "any",
          "startDate": "2023-08-01",
          "duration": "Lifetime",
          "prescribedBy": "doc_001",
          "condition": "Hypertension"
        }
      ],
      "adherenceRate": 96
    },
    {
      "id": "patient_004",
      "firstName": "Hans",
      "lastName": "Müller",
      "email": "hans.mueller@example.com",
      "dateOfBirth": "1950-01-30",
      "gender": "Male",
      "photoUrl": "https://images.unsplash.com/photo-1570825249508-1165536981ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZXVyb3BlYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI1Mjg2MzF8MA&ixlib=rb-4.1.0&q=80&w=400",
      "address": {
        "street": "Kurfürstendamm 89",
        "city": "Berlin",
        "postcode": "10709",
        "country": "Germany"
      },
      "caregiverId": "cg_001",
      "primaryDoctorId": "doc_002",
      "medications": [
        {
          "id": "rx_018",
          "name": "Levodopa",
          "dosage": "100/25mg",
          "frequency": "Three times daily",
          "times": ["08:00", "14:00", "20:00"],
          "mealTiming": "before",
          "startDate": "2021-05-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_002",
          "condition": "Parkinson's disease"
        },
        {
          "id": "rx_019",
          "name": "Bisoprolol",
          "dosage": "5mg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "with",
          "startDate": "2022-02-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_002",
          "condition": "Heart failure"
        }
      ],
      "adherenceRate": 91
    },
    {
      "id": "patient_005",
      "firstName": "Emma",
      "lastName": "Johnson",
      "email": "emma.johnson@example.com",
      "dateOfBirth": "1957-05-17",
      "gender": "Female",
      "photoUrl": "https://images.unsplash.com/photo-1617216939864-e5f02a2a545d?w=400",
      "address": {
        "street": "Calle Mayor 24",
        "city": "Madrid",
        "postcode": "28013",
        "country": "Spain"
      },
      "caregiverId": "cg_003",
      "primaryDoctorId": "doc_002",
      "medications": [
        {
          "id": "rx_025",
          "name": "Aspirin",
          "dosage": "75mg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "with",
          "startDate": "2022-04-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_002",
          "condition": "Cardiovascular protection"
        }
      ],
      "adherenceRate": 93
    },
    {
      "id": "patient_006",
      "firstName": "Jan",
      "lastName": "De Vries",
      "email": "jan.devries@example.com",
      "dateOfBirth": "1953-09-12",
      "gender": "Male",
      "photoUrl": "https://images.unsplash.com/photo-1570825249508-1165536981ce?w=400",
      "address": {
        "street": "Prinsengracht 265",
        "city": "Amsterdam",
        "postcode": "1016 GV",
        "country": "Netherlands"
      },
      "caregiverId": "cg_003",
      "primaryDoctorId": "doc_003",
      "medications": [
        {
          "id": "rx_031",
          "name": "Salbutamol",
          "dosage": "100mcg",
          "frequency": "As needed",
          "times": ["08:00", "12:00", "16:00", "20:00"],
          "mealTiming": "any",
          "startDate": "2019-06-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_003",
          "condition": "COPD"
        },
        {
          "id": "rx_032",
          "name": "Atorvastatin",
          "dosage": "40mg",
          "frequency": "Once daily",
          "times": ["20:00"],
          "mealTiming": "after",
          "startDate": "2021-03-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_003",
          "condition": "High cholesterol"
        }
      ],
      "adherenceRate": 85
    },
    {
      "id": "patient_007",
      "firstName": "Maria",
      "lastName": "Andersson",
      "email": "maria.andersson@example.com",
      "dateOfBirth": "1956-12-03",
      "gender": "Female",
      "photoUrl": "https://images.unsplash.com/photo-1525599428495-0441bd5c67de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZXVyb3BlYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjUyODYzMXww&ixlib=rb-4.1.0&q=80&w=400",
      "address": {
        "street": "Drottninggatan 45",
        "city": "Stockholm",
        "postcode": "111 21",
        "country": "Sweden"
      },
      "caregiverId": "cg_001",
      "primaryDoctorId": "doc_003",
      "medications": [
        {
          "id": "rx_037",
          "name": "Warfarin",
          "dosage": "5mg",
          "frequency": "Once daily",
          "times": ["18:00"],
          "mealTiming": "any",
          "startDate": "2020-08-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_003",
          "condition": "Atrial fibrillation"
        },
        {
          "id": "rx_038",
          "name": "Digoxin",
          "dosage": "125mcg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "any",
          "startDate": "2021-02-15",
          "duration": "Lifetime",
          "prescribedBy": "doc_003",
          "condition": "Heart failure"
        }
      ],
      "adherenceRate": 97
    },
    {
      "id": "patient_008",
      "firstName": "Robert",
      "lastName": "Taylor",
      "email": "robert.taylor@example.com",
      "dateOfBirth": "1951-04-25",
      "gender": "Male",
      "photoUrl": "https://images.unsplash.com/photo-1570825249508-1165536981ce?w=400",
      "address": {
        "street": "Via Veneto 89",
        "city": "Rome",
        "postcode": "00187",
        "country": "Italy"
      },
      "caregiverId": "cg_003",
      "primaryDoctorId": "doc_003",
      "medications": [
        {
          "id": "rx_043",
          "name": "Insulin Glargine",
          "dosage": "20 units",
          "frequency": "Once daily",
          "times": ["22:00"],
          "mealTiming": "any",
          "startDate": "2019-03-01",
          "duration": "Lifetime",
          "prescribedBy": "doc_002",
          "condition": "Type 1 Diabetes"
        },
        {
          "id": "rx_044",
          "name": "Lisinopril",
          "dosage": "20mg",
          "frequency": "Once daily",
          "times": ["08:00"],
          "mealTiming": "any",
          "startDate": "2021-06-10",
          "duration": "Lifetime",
          "prescribedBy": "doc_002",
          "condition": "Hypertension"
        }
      ],
      "adherenceRate": 89
    }
  ]
};

export default databaseData;
