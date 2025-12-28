import { useState, useEffect } from 'react';
import { Users, TrendingUp, Pill, AlertTriangle, UserPlus, Stethoscope, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { loadDatabase } from '../data/database';
import { getAvatarUrl } from '../utils/avatarUtils';
import { calculateAge } from '../utils/dateUtils';

interface DoctorDashboardWebProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
}

export default function DoctorDashboardWeb({ darkMode, setCurrentPage }: DoctorDashboardWebProps) {
  
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const db = await loadDatabase();
        
        // Use Dr. James Anderson (doc_001)
        const currentDoctorId = 'doc_001';
        
        // Get current user to exclude from patient list
        const currentUserStr = localStorage.getItem('currentUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserId = currentUser?.id;
        
        let myPatients = db.patients.filter(p => p.primaryDoctorId === currentDoctorId);
        
        // Exclude current user from patient list
        if (currentUser && currentUser.role === 'patient' && currentUserId) {
          myPatients = myPatients.filter(p => p.id !== currentUserId);
        }

        const patientsData = myPatients.map(patient => ({
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          dateOfBirth: patient.dateOfBirth,
          age: calculateAge(patient.dateOfBirth),
          adherence: patient.adherenceRate,
          photoUrl: getAvatarUrl({
            name: `${patient.firstName} ${patient.lastName}`,
            gender: patient.gender.toLowerCase() as 'male' | 'female',
            customPhotoUrl: patient.photoUrl
          }),
          gender: patient.gender.toLowerCase() as 'male' | 'female',
          medicationsCount: patient.medications?.length || 0,
          status: patient.adherenceRate >= 90 ? 'Excellent' : 
                  patient.adherenceRate >= 80 ? 'Good' : 
                  patient.adherenceRate >= 70 ? 'Fair' : 'At Risk'
        }));

        setPatients(patientsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load patients:', error);
        toast.error('Failed to load patients');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate stats
  const totalPatients = patients.length;
  const averageAdherence = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)
    : 0;
  const totalPrescriptions = patients.reduce((sum, p) => sum + p.medicationsCount, 0);
  const atRisk = patients.filter(p => p.adherence < 70).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400';
      case 'Good': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
      case 'Fair': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400';
      case 'At Risk': return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                }`}>
                  <Users className={`w-6 h-6 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Patients
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalPatients}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Adherence
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {averageAdherence}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <Pill className={`w-6 h-6 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Prescriptions
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalPrescriptions}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    At Risk
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {atRisk}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              My Patients
            </h2>
            
            <Button onClick={() => setCurrentPage('add-patient')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Patient
            </Button>
          </div>

          {/* Patients Grid */}
          {patients.length === 0 ? (
            <Card className={`p-12 text-center border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Stethoscope className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                No patients yet
              </h3>
              <p className={`mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Invite patients to start managing their treatment plans
              </p>
              <Button onClick={() => setCurrentPage('add-patient')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite First Patient
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <Card key={patient.id} className={`p-6 border transition-all hover:shadow-lg cursor-pointer ${
                  darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-purple-700' : 'bg-white border-slate-200 hover:border-purple-300'
                }`}
                onClick={() => {
                  localStorage.setItem('selectedPatient', JSON.stringify(patient));
                  setCurrentPage('patient-details');
                }}>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={patient.photoUrl} alt={patient.name} />
                      <AvatarFallback className="bg-purple-600 text-white text-lg">
                        {patient.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {patient.name}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {patient.age} years old
                      </p>
                      <Badge variant="secondary" className={`mt-1 text-xs ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg mb-3 ${
                    darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Adherence Rate
                      </span>
                      <span className={`text-sm font-bold ${
                        patient.adherence >= 90 ? 'text-green-600' :
                        patient.adherence >= 80 ? 'text-blue-600' :
                        patient.adherence >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {patient.adherence}%
                      </span>
                    </div>
                    <Progress value={patient.adherence} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Pill className={`w-4 h-4 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`} />
                    <span className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {patient.medicationsCount} active prescriptions
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}