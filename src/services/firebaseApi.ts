import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { configureAuthPersistence, enableFirestoreOffline, getFirebaseAuth, getFirestoreDb } from './firebaseClient';

type UserRole = 'patient' | 'caregiver' | 'doctor';

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dateOfBirth?: string;
  onboardingComplete?: boolean;
}

const USERS_COLLECTION = 'users';
const MEDICATIONS_COLLECTION = 'medications';
const CAREGIVER_LINKS_COLLECTION = 'caregiver_links';
const INTAKE_LOGS_COLLECTION = 'intake_logs';

const ensureUserProfile = async (firebaseUser: User, fallbackRole: UserRole = 'patient') => {
  const db = getFirestoreDb();
  const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as AppUser;
  }

  const profile: AppUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'Користувач',
    role: fallbackRole,
    onboardingComplete: false,
  };

  await setDoc(userRef, {
    ...profile,
    createdAt: serverTimestamp(),
  });

  return profile;
};

const mapMedication = (docSnapshot: { id: string; data: () => any }) => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
  };
};

class FirebaseApiService {
  private currentToken: string | null = null;

  constructor() {
    enableFirestoreOffline();
    const auth = getFirebaseAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentToken = await user.getIdToken();
      } else {
        this.currentToken = null;
      }
    });
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    await configureAuthPersistence(rememberMe);
    const auth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    const profile = await ensureUserProfile(credential.user);

    this.currentToken = token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(profile));

    return {
      token,
      user: profile,
    };
  }

  async loginWithGoogle(rememberMe: boolean = true) {
    await configureAuthPersistence(rememberMe);
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();

    try {
      const credential = await signInWithPopup(auth, provider);
      const token = await credential.user.getIdToken();
      const profile = await ensureUserProfile(credential.user);

      this.currentToken = token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(profile));

      return {
        token,
        user: profile,
      };
    } catch (error) {
      await signInWithRedirect(auth, provider);
      return null;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    dateOfBirth?: string;
  }) {
    await configureAuthPersistence(true);
    const auth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const token = await credential.user.getIdToken();

    const profile: AppUser = {
      id: credential.user.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      dateOfBirth: userData.dateOfBirth,
      onboardingComplete: false,
    };

    const db = getFirestoreDb();
    await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });

    this.currentToken = token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(profile));

    return {
      token,
      user: profile,
    };
  }

  async logout() {
    const auth = getFirebaseAuth();
    await signOut(auth);
    this.currentToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser() {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) return null;

    const profile = await ensureUserProfile(auth.currentUser);
    localStorage.setItem('currentUser', JSON.stringify(profile));
    return profile;
  }

  async getMedications() {
    const auth = getFirebaseAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const db = getFirestoreDb();
    const medicationsRef = collection(db, MEDICATIONS_COLLECTION);
    const snapshot = await getDocs(query(medicationsRef, where('userId', '==', userId)));
    return snapshot.docs.map(mapMedication);
  }

  async createMedication(medication: any) {
    const auth = getFirebaseAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Необхідно увійти в систему');

    const db = getFirestoreDb();
    const medicationWithMeta = {
      ...medication,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), medicationWithMeta);
    return { id: docRef.id, ...medicationWithMeta };
  }

  async updateMedication(id: string, medication: any) {
    const db = getFirestoreDb();
    const docRef = doc(db, MEDICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...medication,
      updatedAt: serverTimestamp(),
    });
    return { id, ...medication };
  }

  async deleteMedication(id: string) {
    const db = getFirestoreDb();
    await deleteDoc(doc(db, MEDICATIONS_COLLECTION, id));
    return { success: true };
  }

  async getDependents() {
    const auth = getFirebaseAuth();
    const caregiverId = auth.currentUser?.uid;
    if (!caregiverId) return [];

    const db = getFirestoreDb();
    const linksRef = collection(db, CAREGIVER_LINKS_COLLECTION);
    const linksSnapshot = await getDocs(
      query(linksRef, where('caregiverId', '==', caregiverId), where('status', '==', 'active'))
    );

    const dependentIds = linksSnapshot.docs.map((link) => link.data().patientId);
    if (dependentIds.length === 0) return [];

    const usersRef = collection(db, USERS_COLLECTION);
    const dependentsSnapshot = await getDocs(query(usersRef, where('__name__', 'in', dependentIds)));
    const dependents = dependentsSnapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as any),
    }));

    const medicationsRef = collection(db, MEDICATIONS_COLLECTION);
    const medsSnapshot = await getDocs(query(medicationsRef, where('userId', 'in', dependentIds)));
    const medsByUser = medsSnapshot.docs.reduce<Record<string, any[]>>((acc, docSnapshot) => {
      const med = mapMedication(docSnapshot);
      acc[med.userId] = acc[med.userId] ? [...acc[med.userId], med] : [med];
      return acc;
    }, {});

    return dependents.map((dependent) => ({
      ...dependent,
      medications: medsByUser[dependent.id] || [],
    }));
  }

  async addDependent(dependentData: { patientEmail: string; relationship?: string }) {
    const auth = getFirebaseAuth();
    const caregiverId = auth.currentUser?.uid;
    if (!caregiverId) throw new Error('Необхідно увійти в систему');

    const db = getFirestoreDb();
    const usersRef = collection(db, USERS_COLLECTION);
    const userSnapshot = await getDocs(query(usersRef, where('email', '==', dependentData.patientEmail)));
    const patientDoc = userSnapshot.docs[0];
    if (!patientDoc) {
      throw new Error('Пацієнт з таким email не знайдений');
    }

    const linkPayload = {
      caregiverId,
      patientId: patientDoc.id,
      relationship: dependentData.relationship || 'Опікун',
      status: 'active',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, CAREGIVER_LINKS_COLLECTION), linkPayload);
    return { id: docRef.id, ...linkPayload };
  }

  async revokeCaregiverAccess(linkId: string) {
    const db = getFirestoreDb();
    const docRef = doc(db, CAREGIVER_LINKS_COLLECTION, linkId);
    await updateDoc(docRef, {
      status: 'revoked',
      revokedAt: serverTimestamp(),
    });
    return { success: true };
  }

  async recordIntakeLog(payload: any) {
    const auth = getFirebaseAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Необхідно увійти в систему');

    const db = getFirestoreDb();
    const docRef = await addDoc(collection(db, INTAKE_LOGS_COLLECTION), {
      ...payload,
      userId,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id };
  }
}

export const firebaseApi = new FirebaseApiService();
