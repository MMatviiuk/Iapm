import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Pill,
  Calendar,
  Bell,
  Users,
  Stethoscope,
  Settings,
  Shield,
  Award,
  Printer,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HelpCenterProps {
  darkMode: boolean;
  userRole?: 'myself' | 'caregiver' | 'doctor';
  setCurrentPage: (page: string) => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  role?: 'myself' | 'caregiver' | 'doctor' | 'all';
  keywords: string[];
}

const faqData: FAQItem[] = [
  // Patient FAQs
  {
    id: 'med-add',
    question: 'How do I add a new medication?',
    answer: 'Click the blue "Add Medication" button on the Dashboard. Fill in the medication name, dosage, and times. The wizard will guide you through three simple steps: Essential Info, When to Take, and Optional Details.',
    category: 'Medications',
    role: 'myself',
    keywords: ['add', 'medication', 'prescription', 'new', 'pill']
  },
  {
    id: 'med-mark',
    question: 'How do I mark a medication as taken?',
    answer: 'Go to Today\'s Schedule and tap the large circle next to the medication. A green checkmark will appear. You\'ll see a success message confirming it was marked.',
    category: 'Medications',
    role: 'myself',
    keywords: ['mark', 'taken', 'complete', 'check', 'done']
  },
  {
    id: 'med-skip',
    question: 'What if I missed or skipped a dose?',
    answer: 'You can leave it unmarked or tap the medication to select a reason (forgot, felt sick, ran out). This helps track why doses were missed.',
    category: 'Medications',
    role: 'myself',
    keywords: ['skip', 'miss', 'forgot', 'late']
  },
  {
    id: 'schedule-view',
    question: 'How do I see my weekly schedule?',
    answer: 'Click "Week View" in the navigation menu. You\'ll see a calendar grid showing all your medications for the entire week, organized by day and time.',
    category: 'Schedule',
    role: 'myself',
    keywords: ['week', 'calendar', 'schedule', 'view']
  },
  {
    id: 'print-schedule',
    question: 'Can I print my medication schedule?',
    answer: 'Yes! Click the printer icon on any medication card or use the "Print Week Schedule" button. Your browser\'s print dialog will open with a clean, elderly-friendly format.',
    category: 'Schedule',
    role: 'myself',
    keywords: ['print', 'paper', 'schedule', 'week']
  },
  {
    id: 'notifications',
    question: 'How do I set up medication reminders?',
    answer: 'Go to Settings → Notifications. Turn on "Medication Reminders" and choose how many minutes before each dose you want to be notified (15, 30, or 60 minutes).',
    category: 'Notifications',
    role: 'myself',
    keywords: ['reminder', 'notification', 'alert', 'time']
  },
  {
    id: 'achievements',
    question: 'What are achievements and how do I earn them?',
    answer: 'Achievements reward you for taking medications on time. Complete streaks (3, 7, 30 days), maintain high adherence (90%+), or log medications consistently to earn medals.',
    category: 'Achievements',
    role: 'myself',
    keywords: ['achievement', 'medal', 'reward', 'streak', 'badge']
  },
  {
    id: 'history',
    question: 'How do I see my medication history?',
    answer: 'Click "History" in the menu to see all past medications. You can filter by date range, view adherence statistics, and see which medications you took or missed.',
    category: 'History',
    role: 'myself',
    keywords: ['history', 'past', 'previous', 'log']
  },

  // Caregiver FAQs
  {
    id: 'caregiver-add',
    question: 'How do I add a dependent (family member)?',
    answer: 'Click "Add Dependent" on your dashboard. Enter their name, date of birth, relationship, and optionally upload a photo. They will appear in your dependents list.',
    category: 'Dependents',
    role: 'caregiver',
    keywords: ['add', 'dependent', 'family', 'patient', 'care']
  },
  {
    id: 'caregiver-meds',
    question: 'How do I manage medications for my dependents?',
    answer: 'Click on any dependent\'s card to expand it. You\'ll see their medications with options to Add, Edit, Delete, or Print. Each medication has its own action buttons.',
    category: 'Medications',
    role: 'caregiver',
    keywords: ['medication', 'dependent', 'manage', 'add', 'edit']
  },
  {
    id: 'caregiver-print',
    question: 'Can I print all medications for a dependent?',
    answer: 'Yes! Click the printer icon in the dependent\'s card header. This will open a print-friendly view showing all their medications for the week.',
    category: 'Print',
    role: 'caregiver',
    keywords: ['print', 'schedule', 'dependent', 'medications']
  },
  {
    id: 'caregiver-analytics',
    question: 'How do I track adherence for my dependents?',
    answer: 'Go to Analytics to see adherence rates for all dependents. The dashboard shows average adherence, alerts for low compliance, and detailed statistics.',
    category: 'Analytics',
    role: 'caregiver',
    keywords: ['adherence', 'analytics', 'statistics', 'compliance']
  },
  {
    id: 'caregiver-alerts',
    question: 'How do I get alerts about missed medications?',
    answer: 'Alerts automatically appear on your dashboard when a dependent misses a dose. Check the "Alerts" stat card or enable email notifications in Settings.',
    category: 'Alerts',
    role: 'caregiver',
    keywords: ['alert', 'notification', 'missed', 'warning']
  },

  // Doctor FAQs
  {
    id: 'doctor-add',
    question: 'How do I add a new patient?',
    answer: 'Click "Add Patient" on your dashboard. Enter the patient\'s email address. They will receive an invitation to join and connect their account to yours.',
    category: 'Patients',
    role: 'doctor',
    keywords: ['add', 'patient', 'invite', 'new']
  },
  {
    id: 'doctor-prescribe',
    question: 'How do I prescribe medications for patients?',
    answer: 'Expand a patient\'s card and click "Prescribe" button. Fill out the medication details (name, dosage, frequency, duration). The medication will be added to their schedule.',
    category: 'Prescriptions',
    role: 'doctor',
    keywords: ['prescribe', 'medication', 'prescription', 'rx']
  },
  {
    id: 'doctor-edit',
    question: 'Can I edit or delete patient medications?',
    answer: 'Yes! Each medication has Edit and Delete buttons. Click Edit to modify dosage or timing, or Delete to remove (requires confirmation for safety).',
    category: 'Medications',
    role: 'doctor',
    keywords: ['edit', 'delete', 'change', 'modify', 'medication']
  },
  {
    id: 'doctor-analytics',
    question: 'How do I monitor patient adherence?',
    answer: 'Go to Analytics for cohort statistics. You\'ll see adherence rates, at-risk patients, and trends. Each patient card also shows their individual adherence percentage.',
    category: 'Analytics',
    role: 'doctor',
    keywords: ['adherence', 'analytics', 'monitor', 'compliance', 'statistics']
  },
  {
    id: 'doctor-print',
    question: 'Can I print patient medication schedules?',
    answer: 'Yes! Click the printer icon on any patient\'s card or individual medication. This creates a print-friendly schedule for the patient to take home.',
    category: 'Print',
    role: 'doctor',
    keywords: ['print', 'schedule', 'patient', 'handout']
  },
  {
    id: 'doctor-database',
    question: 'What is the Medication Database?',
    answer: 'The Medication Database is a searchable reference of common medications with photos. Use it to look up medications, check dosage forms, and prescribe accurately.',
    category: 'Reference',
    role: 'doctor',
    keywords: ['database', 'reference', 'lookup', 'search', 'medication']
  },

  // General FAQs (all roles)
  {
    id: 'account-security',
    question: 'Is my health data secure?',
    answer: 'Yes! We use end-to-end encryption, comply with GDPR and HIPAA regulations, and never share your data without permission. All data is encrypted in transit and at rest.',
    category: 'Security',
    role: 'all',
    keywords: ['security', 'privacy', 'hipaa', 'gdpr', 'encryption', 'safe']
  },
  {
    id: 'account-delete',
    question: 'How do I delete my account?',
    answer: 'Go to Settings → Danger Zone at the bottom. Follow the confirmation steps (type DELETE) to permanently remove your account. Note: This action cannot be undone.',
    category: 'Account',
    role: 'all',
    keywords: ['delete', 'remove', 'account', 'close', 'cancel']
  },
  {
    id: 'dark-mode',
    question: 'How do I enable dark mode?',
    answer: 'Go to Settings → Appearance and toggle "Dark Mode". The entire app will switch to a dark theme, easier on the eyes in low-light environments.',
    category: 'Settings',
    role: 'all',
    keywords: ['dark', 'mode', 'theme', 'appearance', 'night']
  },
  {
    id: 'role-switch',
    question: 'Can I switch between roles (Patient/Caregiver/Doctor)?',
    answer: 'Yes! Click your profile photo in the sidebar and select "Switch Role". Choose the role you want to view and the app will show the appropriate dashboard.',
    category: 'Account',
    role: 'all',
    keywords: ['role', 'switch', 'change', 'view', 'mode']
  },
  {
    id: 'mobile-app',
    question: 'Is there a mobile app?',
    answer: 'This is a responsive web app that works perfectly on mobile browsers. Add it to your home screen for app-like experience. Native iOS and Android apps are coming soon!',
    category: 'Mobile',
    role: 'all',
    keywords: ['mobile', 'app', 'phone', 'ios', 'android']
  },
  {
    id: 'support-contact',
    question: 'How do I contact support?',
    answer: 'Scroll down to see contact options: Email (support@prescriptionclarity.com), Live Chat (bottom-right), or call our helpline (Mon-Fri 9am-5pm GMT).',
    category: 'Support',
    role: 'all',
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'chat']
  }
];

const categories = ['All', 'Medications', 'Schedule', 'Notifications', 'Achievements', 'Analytics', 'Security', 'Account'];

export default function HelpCenter({ darkMode, userRole = 'myself', setCurrentPage }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('faq');

  // Filter FAQs based on role, search, and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesRole = faq.role === 'all' || faq.role === userRole;
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRole && matchesCategory && matchesSearch;
  });

  const getRoleTitle = () => {
    switch (userRole) {
      case 'caregiver': return 'Caregiver Help Center';
      case 'doctor': return 'Healthcare Professional Help Center';
      default: return 'Help Center';
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'caregiver': return 'orange';
      case 'doctor': return 'purple';
      default: return 'blue';
    }
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    }
  };

  const roleColors = colorClasses[getRoleColor() as keyof typeof colorClasses];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${roleColors.bg}`}>
              <HelpCircle className={`w-6 h-6 sm:w-7 sm:h-7 ${roleColors.text}`} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {getRoleTitle()}
              </h1>
              <p className={`text-sm sm:text-base ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Find answers and get support
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base sm:text-lg border-2"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 mb-6">
            <TabsTrigger value="faq" className="text-base">
              <Book className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">FAQs</span>
              <span className="sm:hidden">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="text-base">
              <Video className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Guides</span>
              <span className="sm:hidden">Guide</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-base">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Help</span>
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors border-2 ${
                    selectedCategory === category
                      ? `${roleColors.bg} ${roleColors.text} ${roleColors.border}`
                      : darkMode
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div className="space-y-3">
              {filteredFAQs.length === 0 ? (
                <Card className={`p-8 text-center border-2 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    No results found for "{searchQuery}"
                  </p>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Try different keywords or browse by category
                  </p>
                </Card>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-2 overflow-hidden transition-all ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } ${expandedFAQ === faq.id ? roleColors.border : ''}`}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors ${
                          roleColors.hover
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${roleColors.bg} ${roleColors.text} ${roleColors.border}`}>
                              {faq.category}
                            </Badge>
                          </div>
                          <h3 className={`text-base sm:text-lg font-semibold ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className={`w-6 h-6 flex-shrink-0 ${roleColors.text}`} />
                        ) : (
                          <ChevronRight className={`w-6 h-6 flex-shrink-0 ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`} />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`border-t-2 ${
                              darkMode ? 'border-slate-800' : 'border-slate-200'
                            }`}
                          >
                            <div className="p-4 sm:p-5">
                              <p className={`text-base sm:text-lg leading-relaxed ${
                                darkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Getting Started', icon: CheckCircle, time: '5 min', description: 'Learn the basics of using Prescription Clarity' },
                { title: 'Adding Medications', icon: Pill, time: '3 min', description: 'Step-by-step guide to add your first medication' },
                { title: 'Setting Reminders', icon: Bell, time: '4 min', description: 'Configure notifications to never miss a dose' },
                { title: 'Viewing Reports', icon: FileText, time: '6 min', description: 'Understand your adherence statistics' },
                { title: 'Print Schedules', icon: Printer, time: '2 min', description: 'Create printable medication schedules' },
                { title: 'Earning Achievements', icon: Award, time: '3 min', description: 'Track your progress and earn rewards' }
              ].map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-4 sm:p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${
                    darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${roleColors.bg}`}>
                        <guide.icon className={`w-6 h-6 ${roleColors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {guide.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {guide.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${roleColors.bg} ${roleColors.text} ${roleColors.border}`}>
                            {guide.time}
                          </Badge>
                          <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Support */}
              <Card className={`p-6 border-2 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${roleColors.bg}`}>
                  <Mail className={`w-7 h-7 ${roleColors.text}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Email Support
                </h3>
                <p className={`text-base mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Get help via email within 24 hours
                </p>
                <Button className="w-full h-14 text-base" variant="outline">
                  <Mail className="w-5 h-5 mr-2" />
                  support@prescriptionclarity.com
                </Button>
              </Card>

              {/* Live Chat */}
              <Card className={`p-6 border-2 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${roleColors.bg}`}>
                  <MessageCircle className={`w-7 h-7 ${roleColors.text}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Live Chat
                </h3>
                <p className={`text-base mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Chat with our support team now
                </p>
                <Button className={`w-full h-14 text-base ${
                  userRole === 'caregiver' 
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : userRole === 'doctor'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat
                </Button>
              </Card>

              {/* Phone Support */}
              <Card className={`p-6 border-2 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${roleColors.bg}`}>
                  <Phone className={`w-7 h-7 ${roleColors.text}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Phone Support
                </h3>
                <p className={`text-base mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Mon-Fri, 9:00 AM - 5:00 PM GMT
                </p>
                <Button className="w-full h-14 text-base" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  +44 20 1234 5678
                </Button>
              </Card>

              {/* Documentation */}
              <Card className={`p-6 border-2 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${roleColors.bg}`}>
                  <FileText className={`w-7 h-7 ${roleColors.text}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Documentation
                </h3>
                <p className={`text-base mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Comprehensive guides and tutorials
                </p>
                <Button className="w-full h-14 text-base" variant="outline">
                  <Book className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </Card>
            </div>

            {/* Privacy & Security Info */}
            <Card className={`p-6 border-2 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start gap-4">
                <Shield className={`w-8 h-8 ${roleColors.text} flex-shrink-0`} />
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Your Data is Safe with Us
                  </h3>
                  <p className={`text-base ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    We comply with GDPR and HIPAA regulations. All your health data is encrypted end-to-end 
                    and stored securely. We never share your information without your explicit consent.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-sm">
                      <Shield className="w-3 h-3 mr-1" />
                      GDPR Compliant
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Shield className="w-3 h-3 mr-1" />
                      HIPAA Compliant
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Shield className="w-3 h-3 mr-1" />
                      End-to-End Encryption
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className={`p-6 border-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                onClick={() => setCurrentPage('dashboard')}
                variant="outline"
                className="h-12 justify-start"
              >
                <Activity className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => setCurrentPage('settings')}
                variant="outline"
                className="h-12 justify-start"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
              <Button
                onClick={() => setCurrentPage('privacy')}
                variant="outline"
                className="h-12 justify-start"
              >
                <Shield className="w-5 h-5 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
