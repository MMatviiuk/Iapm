import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  BarChart3, 
  Bell, 
  Calendar, 
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Heart,
  Pill,
  Shield, 
  Sparkles,
  Star,
  Stethoscope, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { PillShieldLogo } from './PillShieldLogo';
import { getAvatarUrl } from '../utils/avatarUtils';

interface LandingPageRedesignedProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onQuickDemo?: () => void;
  darkMode: boolean;
}

export default function LandingPageRedesigned({ 
  onGetStarted, 
  onSignIn, 
  onQuickDemo, 
  darkMode 
}: LandingPageRedesignedProps) {
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Features with enhanced descriptions
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Stay on track with intelligent time-based reminders. Coordinate with meals and track adherence automatically.',
      color: 'blue',
      benefit: '95% adherence rate',
    },
    {
      icon: Users,
      title: 'Family Care',
      description: 'Manage medications for your entire family from one dashboard. Perfect for caregivers managing elderly parents.',
      color: 'orange',
      benefit: 'Manage unlimited family members',
    },
    {
      icon: Stethoscope,
      title: 'Healthcare Integration',
      description: 'Doctors can monitor patient adherence in real-time and adjust prescriptions directly through the platform.',
      color: 'purple',
      benefit: 'Real-time provider collaboration',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Visual reports, trend analysis, and streak counters help identify patterns and celebrate consistency.',
      color: 'green',
      benefit: 'Data-driven health decisions',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable push notifications with sound alerts ensure medications are taken at the right time.',
      color: 'amber',
      benefit: '99.9% notification reliability',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encryption with full GDPR and HIPAA compliance. Your health data is always protected.',
      color: 'slate',
      benefit: 'Bank-level security',
    },
  ];

  // Pricing tiers (EUROPEAN PRICING IN EUR)
  const pricingPlans = [
    {
      name: 'Free',
      description: 'Perfect for individuals managing their own medications',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'Up to 5 medications',
        'Basic reminders',
        'Daily schedule view',
        'Adherence tracking',
        'Mobile & web access',
      ],
      cta: 'Get Started Free',
      popular: false,
      role: 'Patient',
      color: 'blue',
    },
    {
      name: 'Personal',
      description: 'For patients who need advanced medication management',
      priceMonthly: 8.99,
      priceYearly: 89,
      features: [
        'Unlimited medications',
        'Smart notifications',
        'Weekly analytics',
        'Medication database',
        'Print schedules',
        'Photo uploads',
        'Achievement system',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: false,
      role: 'Patient',
      color: 'blue',
    },
    {
      name: 'Family',
      description: 'Best for caregivers managing multiple family members',
      priceMonthly: 17.99,
      priceYearly: 179,
      features: [
        'Everything in Personal',
        'Manage up to 5 family members',
        'Caregiver dashboard',
        'Cross-user analytics',
        'Shared medication history',
        'Email notifications',
        'Multi-device sync',
        'Family insights',
      ],
      cta: 'Start Free Trial',
      popular: true,
      role: 'Caregiver',
      color: 'orange',
    },
    {
      name: 'Professional',
      description: 'For healthcare providers managing patient cohorts',
      priceMonthly: 44.99,
      priceYearly: 449,
      features: [
        'Everything in Family',
        'Manage unlimited patients',
        'Doctor dashboard',
        'Cohort analytics',
        'At-risk patient alerts',
        'Prescribing tools',
        'Medication interaction checker',
        'HIPAA compliance tools',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: false,
      role: 'Healthcare Professional',
      color: 'purple',
    },
  ];

  // FAQ items
  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'All paid plans include a 30-day free trial with full access to features. No credit card required to start. Cancel anytime during the trial without being charged.',
    },
    {
      question: 'Is my health data secure?',
      answer: 'Yes! We use bank-level 256-bit encryption for all data. We\'re fully GDPR and HIPAA compliant. Your data is never shared with third parties without your explicit consent.',
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll get immediate access to new features. If you downgrade, changes take effect at the end of your billing cycle.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied for any reason, contact us within 30 days for a full refund.',
    },
    {
      question: 'How do notifications work?',
      answer: 'You can receive notifications via push (mobile), email, and SMS. Set custom reminder times before each dose. Notifications are smart - they adapt to your adherence patterns over time.',
    },
    {
      question: 'Can family members share a subscription?',
      answer: 'Yes! The Family plan allows up to 5 family members under one subscription. Each member gets their own secure account with privacy controls.',
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Yes! Our web app works seamlessly on all devices and is optimized for mobile. We also have native iOS and Android apps (coming soon) with offline support.',
    },
    {
      question: 'What if I need help?',
      answer: 'We offer comprehensive support via email, live chat, and our help center. Personal and higher plans get priority support with faster response times.',
    },
  ];

  // Stats
  const stats = [
    { value: '10,000+', label: 'Active Users', icon: Users },
    { value: '95%', label: 'Adherence Rate', icon: CheckCircle2 },
    { value: '4.9/5', label: 'User Rating', icon: Star },
    { value: '50+', label: 'Countries', icon: Shield },
  ];

  // Testimonials with European photos
  const testimonials = [
    {
      quote: "Prescription Clarity has transformed how I manage my medications. The reminders are perfectly timed, and I haven't missed a dose in months.",
      author: "Margaret Williams",
      role: "Patient",
      duration: "3 months using the platform",
      avatar: getAvatarUrl({ name: 'Sarah Johnson', gender: 'female' }),
      rating: 5,
    },
    {
      quote: "As a caregiver for my elderly parents, this app is a lifesaver. I can manage both their medications from anywhere and get notified if they miss a dose.",
      author: "Michael O'Brien",
      role: "Caregiver",
      duration: "Managing 2 family members",
      avatar: getAvatarUrl({ name: 'Michael Chen', gender: 'male' }),
      rating: 5,
    },
    {
      quote: "The analytics dashboard helps me monitor patient adherence patterns. I can intervene early when I see someone struggling with their medication schedule.",
      author: "Dr. Sarah Mitchell",
      role: "Family Physician",
      duration: "12 patients on platform",
      avatar: getAvatarUrl({ name: 'Dr. Sarah Mitchell', gender: 'female' }),
      rating: 5,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      orange: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      green: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      slate: 'bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPlanColor = (color: string) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
      orange: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
      purple: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        
        {/* Fixed Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
              <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 flex-shrink-0 min-w-0">
                <PillShieldLogo size={40} className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" color="#2196F3" />
                <div className="flex-shrink-0 min-w-0">
                  <h1 className={`text-sm sm:text-lg lg:text-xl font-bold sm:font-extrabold tracking-tight truncate ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Prescription Clarity
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden lg:block mt-0.5">
                    Medication Management Made Simple
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                <Button
                  onClick={onSignIn}
                  variant="outline"
                  className="h-12 sm:h-14 lg:h-16 min-w-[90px] sm:min-w-[110px] lg:min-w-[130px] border-2 text-sm sm:text-base px-4"
                >
                  Sign In
                </Button>
                <Button
                  onClick={onGetStarted}
                  className="h-12 sm:h-14 lg:h-16 min-w-[90px] sm:min-w-[110px] lg:min-w-[130px] bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base px-4"
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 xl:py-32 ${
          darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}>
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center lg:text-left"
              >
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 mb-6">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm lg:text-base font-medium text-blue-900 dark:text-blue-200">
                    Trusted by 10,000+ users worldwide
                  </span>
                </div>
                
                {/* Main Headline */}
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Stay on Track
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">
                    With Your Medications
                  </span>
                </h1>
                
                {/* Subheadline */}
                <p className={`text-lg sm:text-xl lg:text-2xl mb-6 leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  The complete medication management platform trusted by patients, caregivers, and healthcare professionals.
                </p>
                
                {/* Key Benefits */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                  {['95% Adherence Rate', 'GDPR & HIPAA Compliant', 'Free 30-Day Trial'].map((benefit) => (
                    <div
                      key={benefit}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        darkMode ? 'bg-green-950/30 border border-green-800' : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className={`text-sm lg:text-base ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    onClick={onGetStarted}
                    className="h-14 lg:h-16 px-8 lg:px-12 text-lg lg:text-xl bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all group"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {onQuickDemo && (
                    <Button
                      onClick={onQuickDemo}
                      variant="outline"
                      className="h-14 lg:h-16 px-8 lg:px-12 text-lg lg:text-xl border-2"
                    >
                      <Pill className="mr-2 w-6 h-6" />
                      Try Demo
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Hero Image with Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"
                    alt="Medication management dashboard"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                </div>
                
                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`absolute -bottom-6 left-8 right-8 p-6 rounded-2xl backdrop-blur-xl ${
                    darkMode ? 'bg-slate-900/90 border border-slate-700' : 'bg-white/90 border border-slate-200'
                  } shadow-2xl`}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>95%</p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Adherence</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>10K+</p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Users</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-20 lg:mt-32"
            >
              <p className={`text-center text-base lg:text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Trusted by healthcare providers and patients worldwide
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className={`text-3xl lg:text-4xl font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {stat.value}
                        </p>
                        <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-slate-900 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Everything You Need to Stay on Track
                </h2>
                <p className={`text-lg lg:text-xl max-w-3xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Powerful features designed for patients, caregivers, and healthcare professionals
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all group ${
                      darkMode 
                        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${getColorClasses(feature.color)}`}>
                      <Icon className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-base leading-relaxed mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-green-950/30 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      <Zap className="w-4 h-4" />
                      {feature.benefit}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Loved by Users Worldwide
              </h2>
              <p className={`text-lg lg:text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                See what our community has to say
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className={`p-10 lg:p-12 rounded-3xl border shadow-2xl ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Star Rating */}
                    <div className="flex gap-2 mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    
                    <blockquote>
                      <p className={`text-2xl lg:text-3xl mb-8 leading-relaxed ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        "{testimonials[currentTestimonial].quote}"
                      </p>
                      <footer className="flex items-center gap-5">
                        <img
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].author}
                          className="w-20 h-20 rounded-full border-2 border-blue-600 object-cover"
                        />
                        <div>
                          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {testimonials[currentTestimonial].author}
                          </p>
                          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].duration}
                          </p>
                        </div>
                      </footer>
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'w-8 bg-blue-600'
                        : 'w-2 bg-slate-300 dark:bg-slate-600'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 lg:py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your Plan
              </h2>
              <p className={`text-lg lg:text-xl mb-8 ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Start free, upgrade when you need more
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-3 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-3 rounded-full transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-full transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border-2 shadow-xl transition-all ${
                    plan.popular
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-orange-500/20'
                      : darkMode
                      ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {plan.description}
                    </p>
                    <div className="mb-2">
                      <span className={`text-5xl font-bold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        €{selectedPlan === 'monthly' ? plan.priceMonthly.toFixed(2) : (plan.priceYearly / 12).toFixed(2)}
                      </span>
                      <span className={`text-lg ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        /month
                      </span>
                    </div>
                    {selectedPlan === 'yearly' && plan.priceYearly > 0 && (
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        €{plan.priceYearly}/year billed annually
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={onGetStarted}
                    className={`w-full h-14 mb-6 ${
                      plan.popular
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className={`text-base ${
                          darkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className={`text-center text-base mt-8 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              All plans include a 30-day free trial. No credit card required.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-lg lg:text-xl ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Everything you need to know about Prescription Clarity
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border overflow-hidden ${
                    darkMode 
                      ? 'bg-slate-800/50 border-slate-700' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className={`text-lg font-bold pr-8 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 flex-shrink-0 transition-transform ${
                        openFAQ === index ? 'rotate-180' : ''
                      } ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 pb-6 text-base leading-relaxed ${
                          darkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-slate-900 py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Ready to Transform Your Medication Management?
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join thousands of users managing their medications with confidence. 
                Start your free 30-day trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={onGetStarted}
                  className="h-16 px-12 text-xl bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all group"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </Button>
                {onQuickDemo && (
                  <Button
                    onClick={onQuickDemo}
                    variant="outline"
                    className="h-16 px-12 text-xl border-2 border-white text-white hover:bg-white/20 bg-white/10"
                  >
                    Try Demo
                  </Button>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-blue-500/30">
                <div className="flex flex-col items-center gap-3">
                  <Shield className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">GDPR & HIPAA Compliant</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">No Credit Card Required</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Clock className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">Free 30-Day Trial</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t py-16 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
              <div>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Product
                </h3>
                <ul className="space-y-4">
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Features</a></li>
                  <li><a href="#pricing" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pricing</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Security</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Company
                </h3>
                <ul className="space-y-4">
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>About</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Blog</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Resources
                </h3>
                <ul className="space-y-4">
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Help Center</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Community</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Legal
                </h3>
                <ul className="space-y-4">
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Privacy</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Terms</a></li>
                  <li><a href="#" className={`text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>GDPR & HIPAA</a></li>
                </ul>
              </div>
            </div>
            
            <div className={`pt-10 border-t ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <PillShieldLogo size={40} color="#2196F3" />
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Prescription Clarity
                  </span>
                </div>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  © 2025 Prescription Clarity. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}