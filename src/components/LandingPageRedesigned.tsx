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
import nurseImage from '../assets/1d64c71f8bddf49650649420b23ec2f86cd09bee.png';

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
      title: 'Розумне планування',
      description: 'Залишайтеся в графіку з інтелектуальними нагадуваннями. Координуйте з прийомами їжі та відстежуйте дотримання автоматично.',
      color: 'blue',
      benefit: '95% дотримання графіку',
    },
    {
      icon: Users,
      title: 'Сімейний догляд',
      description: 'Керуйте ліками для всієї родини з одної панелі. Ідеально для догляду за літніми батьками.',
      color: 'orange',
      benefit: 'Необмежена кількість членів сім\'ї',
    },
    {
      icon: Stethoscope,
      title: 'Інтеграція з лікарями',
      description: 'Лікарі можуть відстежувати дотримання пацієнтів у реальному часі та коригувати призначення безпосередньо через платформу.',
      color: 'purple',
      benefit: 'Співпраця з лікарями у реальному часі',
    },
    {
      icon: BarChart3,
      title: 'Аналітика та звіти',
      description: 'Візуальні звіти, аналіз тенденцій та лічильники серій допомагають визначити закономірності та відзначити послідовність.',
      color: 'green',
      benefit: 'Рішення на основі даних',
    },
    {
      icon: Bell,
      title: 'Розумні сповіщення',
      description: 'Налаштовувані push-сповіщення зі звуковими сигналами гарантують прийом ліків у потрібний час.',
      color: 'amber',
      benefit: '99.9% надійність сповіщень',
    },
    {
      icon: Shield,
      title: 'Безпечно та конфіденційно',
      description: 'Наскрізне шифрування з повною відповідністю GDPR та HIPAA. Ваші медичні дані завжди захищені.',
      color: 'slate',
      benefit: 'Захист ваших даних',
    },
  ];

  // Pricing tiers (UKRAINIAN PRICING IN UAH)
  const pricingPlans = [
    {
      name: 'Безкоштовний',
      description: 'Ідеально для тих, хто керує своїми ліками самостійно',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'До 5 ліків',
        'Базові нагадування',
        'Перегляд денного розкладу',
        'Відстеження дотримання',
        'Доступ з мобільного та веб',
      ],
      cta: 'Почати безкоштовно',
      popular: false,
      role: 'Пацієнт',
      color: 'blue',
    },
    {
      name: 'Персональний',
      description: 'Для пацієнтів, яким потрібне розширене керування ліками',
      priceMonthly: 249,
      priceYearly: 2490,
      features: [
        'Необмежена кількість ліків',
        'Розумні сповіщення',
        'Тижнева аналітика',
        'База даних ліків',
        'Друк розкладів',
        'Завантаження фото',
        'Система досягнень',
        'Пріоритетна підтримка',
      ],
      cta: 'Спробувати безкоштовно',
      popular: false,
      role: 'Пацієнт',
      color: 'blue',
    },
    {
      name: 'Сімейний',
      description: 'Найкраще для опікунів, які керують кількома членами родини',
      priceMonthly: 449,
      priceYearly: 4490,
      features: [
        'Все з Персонального',
        'Керування до 5 членів родини',
        'Панель опікуна',
        'Аналітика між користувачами',
        'Спільна історія ліків',
        'Email-сповіщення',
        'Синхронізація на кількох пристроях',
        'Сімейна аналітика',
      ],
      cta: 'Спробувати безкоштовно',
      popular: true,
      role: 'Опікун',
      color: 'orange',
    },
    {
      name: 'Професійний',
      description: 'Для медичних працівників, які керують групами пацієнтів',
      priceMonthly: 1199,
      priceYearly: 11990,
      features: [
        'Все з Сімейного',
        'Необмежена кількість пацієнтів',
        'Панель лікаря',
        'Аналітика груп',
        'Сповіщення про пацієнтів у зоні ризику',
        'Інструменти призначення',
        'Перевірка взаємодії ліків',
        'Інструменти відповідності HIPAA',
        'Пріоритетна підтримка',
      ],
      cta: 'Спробувати безкоштовно',
      popular: false,
      role: 'Медичний працівник',
      color: 'purple',
    },
  ];

  // FAQ items
  const faqs = [
    {
      question: 'Як працює безкоштовний пробний період?',
      answer: 'Усі платні плани включають 30-денний безкоштовний пробний період з повним доступом до функцій. Кредитна картка не потрібна для початку. Скасуйте в будь-який час під час пробного періоду без списання коштів.',
    },
    {
      question: 'Чи захищені мої медичні дані?',
      answer: 'Так! Ми використовуємо сучасне шифрування для всіх даних. Дотримуємось вимог GDPR. Ваші дані ніколи не передаються третім особам без вашої явної згоди.',
    },
    {
      question: 'Чи можу я змінити план пізніше?',
      answer: 'Звичайно! Ви можете оновити або знизити свій план у будь-який час. При оновленні ви отримаєте негайний доступ до нових функцій. При зниженні зми набувають чинності в кінці вашого платіжного циклу.',
    },
    {
      question: 'Чи надаєте ви повернення коштів?',
      answer: 'Так, ми пропонуємо 30-денну гарантію повернення грошей на всі платні плани. Якщо ви не задоволені з будь-якої причини, зв\'яжіться з нами протягом 30 днів для повного повернення коштів.',
    },
    {
      question: 'Як працюють сповіщення?',
      answer: 'Ви можете отримувати сповіщення через push (мобільний), email та SMS. Встановіть власний час нагадування перед кожною дозою. Сповіщення розумні - вони адаптуються до ваших шаблонів дотримання з часом.',
    },
    {
      question: 'Чи можуть члени родини ділитися підпискою?',
      answer: 'Так! Сімейний план дозволяє до 5 членів родини в рамках однієї підписки. Кожен член отримує власний захищений обліковий запис з контролем конфіденційності.',
    },
    {
      question: 'Чи є мобільний додаток?',
      answer: 'Так! Наш веб-додаток бездоганно працює на всіх пристроях і оптимізований для мобільних. У нас також є нативні додатки iOS та Android (скоро) з підтримкою офлайн-режиму.',
    },
    {
      question: 'Що робити, якщо мені потрібна допомога?',
      answer: 'Ми пропонуємо комплексну підтримку через email, живий чат та наш довідковий центр. Персональний та вищі плани отримують пріоритетну підтримку з швидшим часом відповіді.',
    },
  ];

  // Stats
  const stats = [
    { value: '10,000+', label: 'Користувачів в Україні', icon: Users },
    { value: '95%', label: 'Дотримання графіку', icon: CheckCircle2 },
    { value: '4.9/5', label: 'Оцінка користувачів', icon: Star },
    { value: 'Вся Україна', label: 'Доставка', icon: Shield },
  ];

  // Testimonials with Ukrainian names
  const testimonials = [
    {
      quote: "120+ змінив те, як я керую своїми ліками. Нагадування ідеально налаштовані, і я не пропустила жодної дози вже кілька місяців.",
      author: "Олена Коваленко",
      role: "Пацієнт",
      duration: "3 місяці користування",
      avatar: getAvatarUrl({ name: 'Sarah Johnson', gender: 'female' }),
      rating: 5,
    },
    {
      quote: "Як опікун своїх літніх батьків, цей додаток - справжній рятівник. Я можу керувати їхніми ліками звідки завгодно та отримувати сповіщення, якщо вони пропускають дозу.",
      author: "Андрій Мельник",
      role: "Опікун",
      duration: "Доглядає 2 родичів",
      avatar: getAvatarUrl({ name: 'Michael Chen', gender: 'male' }),
      rating: 5,
    },
    {
      quote: "Панель аналітики допомагає мені відстежувати, як пацієнти дотримуються графіку. Я можу вчасно втрутитися, коли бачу проблеми з прийомом ліків.",
      author: "Д-р Наталія Шевченко",
      role: "Сімейний лікар",
      duration: "12 пацієнтів на платформі",
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
      <div className={darkMode ? 'bg-slate-900' : 'bg-white'}>
        
        {/* Fixed Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
              <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 flex-shrink-0 min-w-0">
                <PillShieldLogo size={48} className="flex-shrink-0" color="#2196F3" />
                <div className="flex-shrink-0 min-w-0">
                  <h1 className={`text-lg sm:text-2xl lg:text-3xl font-bold sm:font-extrabold tracking-tight truncate ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    120+
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                    120+ років здоров'я
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                <Button
                  onClick={onSignIn}
                  variant="outline"
                  className="h-12 sm:h-14 lg:h-16 min-w-[90px] sm:min-w-[110px] lg:min-w-[130px] border-2 text-sm sm:text-base px-4"
                >
                  Увійти
                </Button>
                <Button
                  onClick={onGetStarted}
                  className="h-12 sm:h-14 lg:h-16 min-w-[90px] sm:min-w-[110px] lg:min-w-[130px] bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base px-4"
                >
                  Почати
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`relative overflow-hidden py-1 sm:py-2 lg:py-4 ${ 
          darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50 via-white to-slate-50'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"
            />
          </div>
          
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center lg:text-left"
              >
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-900 dark:text-blue-200">
                    Довіряють тисячі українців
                  </span>
                </div>
                
                {/* Main Headline */}
                <h1 className={`text-xl sm:text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 leading-tight ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Дбайте про здоров'я
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">
                    завжди вчасно
                  </span>
                </h1>
                
                {/* Subheadline */}
                <p className={`text-sm sm:text-base lg:text-lg mb-3 leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Платформа для контролю прийому ліків. Для пацієнтів, родичів та лікарів.
                </p>
                
                {/* Key Benefits */}
                <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start mb-4">
                  {['95% дотримання графіку', 'GDPR та HIPAA', '30 днів безкоштовно'].map((benefit) => (
                    <div
                      key={benefit}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        darkMode ? 'bg-green-950/30 border border-green-800' : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                  <Button
                    onClick={onGetStarted}
                    className="h-11 sm:h-12 lg:h-14 px-5 lg:px-8 text-sm lg:text-base bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all group"
                  >
                    Почати безкоштовно
                    <ArrowRight className="ml-1.5 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {onQuickDemo && (
                    <Button
                      onClick={onQuickDemo}
                      variant="outline"
                      className="h-11 sm:h-12 lg:h-14 px-5 lg:px-8 text-sm lg:text-base border-2"
                    >
                      <Pill className="mr-1.5 w-4 h-4 lg:w-5 lg:h-5" />
                      Спробувати демо
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Hero Image - Nurse (VISIBLE ON ALL SCREENS) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative mt-0 lg:mt-0"
              >
                <div className="relative max-w-[180px] sm:max-w-[220px] mx-auto lg:max-w-[280px]">
                  {/* White/gradient background layer behind transparent PNG */}
                  <div 
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{
                      background: darkMode 
                        ? 'linear-gradient(to bottom, #1e293b, #0f172a)' 
                        : 'linear-gradient(to bottom, #eff6ff, #ffffff, #f8fafc)',
                      transform: 'scale(1.1)'
                    }}
                  />
                  <img
                    src={nurseImage}
                    alt="Професійна медична підтримка"
                    className="w-full h-auto object-contain relative z-10"
                    style={{ 
                      filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))',
                      maxHeight: '300px'
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 lg:mt-12"
            >
              <p className={`text-center text-xs sm:text-sm mb-3 lg:mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Довіряють лікарі та пацієнти в Україні
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-2 lg:p-4 rounded-lg lg:rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-1.5 lg:mb-3 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className={`text-sm sm:text-base lg:text-2xl font-bold mb-0.5 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {stat.value}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
        <section className="bg-white dark:bg-slate-900 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={`text-2xl lg:text-4xl font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Все, що потрібно для дотримання графіку
                </h2>
                <p className={`text-base lg:text-lg max-w-3xl mx-auto ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Потужні функції, розроблені для пацієнтів, опікунів та медичних працівників
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                Відгуки наших користувачів
              </h2>
              <p className={`text-lg lg:text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Подивіться, що кажуть люди про 120+
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
                    aria-label={`Перейти до відгуку ${index + 1}`}
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
                Виберіть свій план
              </h2>
              <p className={`text-lg lg:text-xl mb-8 ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Почніть безкоштовно, оновіться коли потрібно більше
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
                  Щомісяця
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-full transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Щороку
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Економія 17%
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
                      Найпопулярніший
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
                        {plan.priceMonthly === 0 ? '₴0' : `₴${selectedPlan === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12)}`}
                      </span>
                      <span className={`text-lg ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        /міс
                      </span>
                    </div>
                    {selectedPlan === 'yearly' && plan.priceYearly > 0 && (
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        ₴{plan.priceYearly}/рік при річній оплаті
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
              Усі плани включають 30-денний безкоштовний пробний період. Кредитна картка не потрібна.
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
                Часті запитання
              </h2>
              <p className={`text-lg lg:text-xl ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Все, що вам потрібно знати про 120+
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
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 lg:mb-8 leading-tight px-4">
                Готові почати?
              </h2>
              <p className="text-base sm:text-xl lg:text-2xl text-blue-100 mb-8 lg:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
                Приєднуйтесь до тисяч українців. Почніть безкоштовно.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <Button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-xl bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all group"
                >
                  <span className="hidden sm:inline">Почати безкоштовний пробний період</span>
                  <span className="sm:hidden">Почати безкоштовно</span>
                  <ArrowRight className="ml-3 w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" />
                </Button>
                {onQuickDemo && (
                  <Button
                    onClick={onQuickDemo}
                    variant="outline"
                    className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-xl border-2 border-white text-white hover:bg-white/20 bg-white/10"
                  >
                    Спробувати демо
                  </Button>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-blue-500/30">
                <div className="flex flex-col items-center gap-3">
                  <Shield className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">GDPR та HIPAA</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">Без кредитної картки</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Clock className="w-12 h-12 text-blue-200" />
                  <p className="text-lg text-blue-100">30 днів безкоштовно</p>
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
                <h3 className={`text-base sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Продукт
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Функції</a></li>
                  <li><a href="#pricing" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Ціни</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Безпека</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-base sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Компанія
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Про нас</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Блог</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Кар'єра</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-base sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Ресурси
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Довідковий центр</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Спільнота</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Контакти</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`text-base sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Юридичне
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Конфіденційність</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Умови</a></li>
                  <li><a href="#" className={`text-sm sm:text-lg hover:text-blue-600 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>GDPR та HIPAA</a></li>
                </ul>
              </div>
            </div>
            
            <div className={`pt-10 border-t ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <PillShieldLogo size={40} color="#2196F3" />
                  <div>
                    <span className={`text-xl font-bold block ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      120+
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                      120+ років здоров'я
                    </span>
                  </div>
                </div>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                   © 2026 120+. Усі права захищені.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
