import { useState, useEffect } from 'react';
import { Users, TrendingUp, Pill, Plus, UserPlus, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
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

interface CaregiverDashboardWebProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
}

export default function CaregiverDashboardWeb({ darkMode, setCurrentPage }: CaregiverDashboardWebProps) {
  
  const [dependents, setDependents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const db = await loadDatabase();
        
        // Use Catherine Bennett (cg_001)
        const currentCaregiverId = 'cg_001';
        const myDependents = db.patients.filter(p => p.caregiverId === currentCaregiverId);

        const dependentsData = myDependents.map(patient => ({
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
          relationship: 'Family Member'
        }));

        setDependents(dependentsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dependents:', error);
        toast.error('Failed to load dependents');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate stats
  const totalDependents = dependents.length;
  const averageAdherence = dependents.length > 0
    ? Math.round(dependents.reduce((sum, d) => sum + d.adherence, 0) / dependents.length)
    : 0;
  const totalMedications = dependents.reduce((sum, d) => sum + d.medicationsCount, 0);
  const atRisk = dependents.filter(d => d.adherence < 80).length;

  return (
    <div className="min-h-screen">
      <div className="p-4 lg:p-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Stats Grid - COMPACT */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-orange-500/10' : 'bg-orange-50'
                }`}>
                  <Users className={`w-6 h-6 ${
                    darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Dependents
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalDependents}
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
                    Avg Adherence
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
                    Total Rx
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalMedications}
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
                  <AlertCircle className={`w-6 h-6 ${
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
              My Dependents
            </h2>
            
            <Button onClick={() => setCurrentPage('add-dependent')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Dependent
            </Button>
          </div>

          {/* Dependents Grid */}
          {dependents.length === 0 ? (
            <Card className={`p-12 text-center border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Users className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                No dependents yet
              </h3>
              <p className={`mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Add family members to start managing their medications
              </p>
              <Button onClick={() => setCurrentPage('add-dependent')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Dependent
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dependents.map((dependent) => (
                <Card key={dependent.id} className={`p-6 border transition-all hover:shadow-lg cursor-pointer ${
                  darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-orange-700' : 'bg-white border-slate-200 hover:border-orange-300'
                }`}
                onClick={() => {
                  localStorage.setItem('selectedDependent', JSON.stringify(dependent));
                  setCurrentPage('dependent-details');
                }}>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={dependent.photoUrl} alt={dependent.name} />
                      <AvatarFallback className="bg-orange-500 text-white text-lg">
                        {dependent.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {dependent.name}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {dependent.age} years old
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg mb-3 ${
                    darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Adherence
                      </span>
                      <span className={`text-sm font-bold ${
                        dependent.adherence >= 90 ? 'text-green-600' :
                        dependent.adherence >= 80 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {dependent.adherence}%
                      </span>
                    </div>
                    <Progress value={dependent.adherence} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className={`w-4 h-4 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {dependent.medicationsCount} medications
                      </span>
                    </div>
                    
                    {dependent.adherence < 80 && (
                      <Badge variant="destructive" className="text-xs">
                        At Risk
                      </Badge>
                    )}
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