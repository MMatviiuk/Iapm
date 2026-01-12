import React from 'react';

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
  darkMode,
}: LandingPageRedesignedProps) {
  const rootClassName = darkMode ? 'dark' : '';
  const navClassName = darkMode
    ? 'bg-[#020617]/90 border-white/10'
    : 'bg-white/80 border-slate-100';
  const navButtonClassName = darkMode
    ? 'text-white bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30'
    : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100';
  const mainClassName = darkMode ? 'mesh-gradient-navy' : 'mesh-gradient-light';
  const titleClassName = darkMode ? 'text-white' : 'text-[#020617]';
  const bodyClassName = darkMode ? 'text-slate-300' : 'text-slate-600';
  const cardClassName = darkMode ? 'glass-card' : 'glass-card-light';
  const footerClassName = darkMode ? 'bg-[#020617]' : 'bg-white';
  const footerTextClassName = darkMode ? 'text-slate-400' : 'text-slate-500';
  const iconColorClassName = darkMode ? 'text-blue-500' : 'text-blue-600';
  const pageBaseClassName = darkMode
    ? 'text-slate-100 selection:bg-blue-500/30'
    : 'bg-white text-[#020617]';

  return (
    <div className={rootClassName}>
      <div className={`min-h-screen antialiased ${pageBaseClassName}`}>
        <nav
          className={`sticky top-0 z-50 flex items-center justify-between border-b p-4 backdrop-blur-xl ${navClassName}`}
        >
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center ${iconColorClassName}`}>
              <span className="material-symbols-outlined text-3xl">medical_services</span>
              <span className="material-symbols-outlined -ml-2 text-3xl">shield</span>
            </div>
            <h2 className={`text-2xl font-black tracking-tighter ${titleClassName}`}>120+</h2>
          </div>
          <button
            type="button"
            onClick={onSignIn}
            className={`rounded-full border px-5 py-2 text-sm font-bold transition-all ${navButtonClassName}`}
          >
            Увійти
          </button>
        </nav>

        <main className={`overflow-x-hidden ${mainClassName}`}>
          <section className="px-6 pb-16 pt-10">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="relative mb-12 w-full">
                <div
                  className={`absolute -inset-10 rounded-full blur-[100px] ${
                    darkMode ? 'bg-blue-600/20' : 'bg-blue-400/10'
                  }`}
                />
                <div
                  className={`relative aspect-[4/5] w-full overflow-hidden rounded-[3rem] shadow-2xl ${
                    darkMode
                      ? 'border border-white/10 ring-1 ring-white/5'
                      : 'border border-white ring-1 ring-slate-100'
                  }`}
                >
                  <img
                    alt="Усміхнений чоловік похилого віку зі смартфоном"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFGlwl2Te5U689EFiexm5J_VQdVtxFAVA8OdmIQBLqxtFfAYOmoC32TA3gINzAaCBczKM49_tetkPfwqLzZMbAWPF4ThZeaX3uyaPGhVemOjJxnq6ijD24Z2GBxuspNx6sfvuTeyBTDmmxmHwY62kH5ab2Hm4RndWnD-ZWjI6bg1Rk0Opb9Lz4gyFhEHT2WjB1qoOTJlcLMWYqsGZwAaI7G6nPSp1UPtgnYA3fYq4ZmRZpaBkUbRMnEYxFbwdre8Gi7jHH6kuisz0"
                  />
                  <div
                    className={`absolute bottom-8 left-6 right-6 flex items-center gap-4 rounded-2xl p-5 text-left shadow-2xl ${cardClassName}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                      <span className="material-symbols-outlined text-2xl">notifications_active</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400">
                        Нагадування
                      </p>
                      <p className={`text-base font-bold ${titleClassName}`}>Час прийняти Вітамін D</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-10 flex flex-col gap-5">
                <h1 className={`text-5xl font-black leading-none tracking-tight md:text-6xl ${titleClassName}`}>
                  120+ років здоров'я
                </h1>
                <p className={`px-2 text-lg font-medium leading-relaxed ${bodyClassName}`}>
                  Ваш персональний помічник у світі довголіття, створений для легкості та впевненості у кожному дні.
                </p>
              </div>

              <button
                type="button"
                onClick={onGetStarted}
                className={`flex min-h-[72px] w-full items-center justify-center rounded-2xl bg-blue-600 text-xl font-extrabold tracking-tight text-white transition-all ${
                  darkMode
                    ? 'shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] hover:bg-blue-500'
                    : 'shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] hover:bg-blue-700'
                }`}
              >
                Почати безкоштовно
              </button>

              {onQuickDemo && (
                <button
                  type="button"
                  onClick={onQuickDemo}
                  className={`mt-4 text-sm font-bold uppercase tracking-widest ${
                    darkMode ? 'text-blue-200/70 hover:text-blue-200' : 'text-blue-600/70 hover:text-blue-600'
                  }`}
                >
                  Переглянути демо
                </button>
              )}

              <p
                className={`mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
                  darkMode ? 'text-blue-200/50' : 'text-blue-600/60'
                }`}
              >
                <span className="material-symbols-outlined text-lg text-blue-400">verified</span>
                Рекомендовано фахівцями
              </p>
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="mx-auto max-w-md space-y-5">
              <div className={`flex items-start gap-5 rounded-[2.5rem] p-7 shadow-sm ${cardClassName}`}>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
                <div>
                  <h4 className={`text-xl font-extrabold ${titleClassName}`}>Великі кнопки</h4>
                  <p className={`text-base font-medium leading-relaxed ${bodyClassName}`}>
                    Спеціальний дизайн для безпомилкового керування навіть одним дотиком.
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-5 rounded-[2.5rem] p-7 shadow-sm ${cardClassName}`}>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                  <span className="material-symbols-outlined text-3xl">visibility</span>
                </div>
                <div>
                  <h4 className={`text-xl font-extrabold ${titleClassName}`}>Висока контрастність</h4>
                  <p className={`text-base font-medium leading-relaxed ${bodyClassName}`}>
                    Чіткий текст та яскраві елементи, що легко читаються при будь-якому освітленні.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={`px-6 py-16 ${darkMode ? '' : 'bg-slate-50 border-y border-slate-100'}`}>
            <div className="mx-auto max-w-md">
              <div className="mb-10 text-center">
                <h2 className={`text-4xl font-black tracking-tight ${titleClassName}`}>
                  Відгуки користувачів
                </h2>
              </div>
              <div className="space-y-6">
                <div className={`rounded-[2.5rem] p-6 ${cardClassName}`}>
                  <div className="mb-4 flex items-center gap-4">
                    <div>
                      <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
                        <img
                          alt="Марія Іванівна"
                          className="h-full w-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCviNYo1b1rluUqpHKTqDgV7j9GOAaNWMWtehtqrZDaFCMrccF_3rrhYLArFARilC3iDuttDsEQTyKFbxiZNH2anMns5ehFASMpD89Zf4iUWSc3_s9ph6BoD52jRdmbF3IQYqvylC5F-Hoi-XqBgrBZQjTzHZ21w5Wtdkfp88llMWZ3wZ-G2FcGoe05pGNkzJ_b5kFYRymx79N7py3-bxStIBmg5muDbVwa0bLM_GMo11VLBgMvoigYSfo2b8oo31Qf50jFh4TPMMM"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-bold ${titleClassName}`}>Марія Іванівна</h4>
                      <div className="flex text-amber-400">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                      </div>
                    </div>
                  </div>
                  <p className={`${bodyClassName} font-medium italic`}>
                    "Завдяки 120+ я нарешті перестала забувати про ліки. Дизайн дуже зрозумілий для мене!"
                  </p>
                </div>
                <div className={`rounded-[2.5rem] p-6 ${cardClassName}`}>
                  <div className="mb-4 flex items-center gap-4">
                    <div>
                      <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
                        <img
                          alt="Олександр Петрович"
                          className="h-full w-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS9FjTLLlpRWSjzxPxPlUtr2--N6_xHonfHMV4H63sXV5Xb_d60LMUJYF-69xPV8qGPW7v3m6npE-JZsFGLsPoCA-F7Bjmkp37mZI0C-j3ydYsgfeipXFKaDkrFQW4rEDw4MSpq9H_xc322hsYjRlG4IPgv8Uk67I5IMGzo6ZlkSsO9O7jreVkB_TsaftNlRCQtBqDSUDB6TsTY2_AGivU91D2GnVJ8nSp9HP9CKWMtD5GLvwDKIKfPZkOK_uTrjqsdv00vYvWsdc"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-bold ${titleClassName}`}>Олександр Петрович</h4>
                      <div className="flex text-amber-400">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span className="material-symbols-outlined text-xs">star</span>
                      </div>
                    </div>
                  </div>
                  <p className={`${bodyClassName} font-medium italic`}>
                    "Великі кнопки — це саме те, що мені було потрібно. Дуже зручний додаток."
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-20">
            <div className="mx-auto max-w-md">
              <div className="mb-14 text-center">
                <h2 className={`text-5xl font-black tracking-tight ${titleClassName}`}>Плани турботи</h2>
                <p className={`${bodyClassName} mt-4 text-lg font-medium leading-relaxed`}>
                  Оберіть рівень підтримки, який відповідає вашим потребам
                </p>
              </div>
              <div className="space-y-8">
                <div className={`rounded-[3rem] p-8 transition-all hover:ring-2 ${cardClassName} ${darkMode ? 'hover:ring-blue-500/30' : 'hover:ring-blue-500/20'}`}>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Базовий</p>
                      <h3 className={`text-3xl font-black tracking-tight ${titleClassName}`}>Безкоштовно</h3>
                    </div>
                    <span className="material-symbols-outlined text-blue-400 text-4xl">favorite</span>
                  </div>
                  <ul className="mb-12 space-y-6">
                    {[
                      'Нагадування про ліки',
                      'Один особистий профіль',
                      'Щоденник симптомів',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
                        <span className={`${titleClassName} text-lg font-semibold leading-snug`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className={`flex h-[64px] w-full items-center justify-center rounded-2xl text-xl font-black transition-all ${
                      darkMode
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        : 'bg-slate-50 text-[#020617] border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Обрати план
                  </button>
                </div>
                <div
                  className={`relative overflow-hidden rounded-[3rem] p-8 shadow-[0_20px_40px_rgba(59,130,246,0.1)] ${
                    darkMode
                      ? 'glass-card ring-2 ring-blue-500/50'
                      : 'glass-card-light ring-2 ring-blue-500/30'
                  }`}
                >
                  <div className="absolute right-0 top-0 p-6">
                    <span className="rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                      Рекомендовано
                    </span>
                  </div>
                  <div className="mb-6">
                    <p className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Персональний</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`${titleClassName} text-5xl font-black tracking-tighter`}>249</span>
                      <span className={`${bodyClassName} text-xl font-bold`}>₴/міс</span>
                    </div>
                  </div>
                  <ul className="mb-12 space-y-6">
                    {[
                      'Все з Базового плану',
                      'Звіт для лікаря (PDF)',
                      'Аналіз динаміки показників',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
                        <span className={`${titleClassName} text-lg font-semibold leading-snug`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className={`flex h-[64px] w-full items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95`}
                  >
                    Спробувати зараз
                  </button>
                </div>
                <div className={`rounded-[3rem] p-8 transition-all hover:ring-2 ${cardClassName} ${darkMode ? 'hover:ring-blue-500/30' : 'hover:ring-blue-500/20'}`}>
                  <div className="mb-6">
                    <p className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Сімейний</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`${titleClassName} text-5xl font-black tracking-tighter`}>449</span>
                      <span className={`${bodyClassName} text-xl font-bold`}>₴/міс</span>
                    </div>
                  </div>
                  <ul className="mb-12 space-y-6">
                    {[
                      'До 5 профілів родичів',
                      'Екстрені сповіщення',
                      'Голосова підтримка 24/7',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
                        <span className={`${titleClassName} text-lg font-semibold leading-snug`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className={`flex h-[64px] w-full items-center justify-center rounded-2xl text-xl font-black transition-all ${
                      darkMode
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        : 'bg-slate-50 text-[#020617] border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Обрати для сім'ї
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className={`px-6 py-20 text-center ${footerClassName}`}>
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className={`flex items-center justify-center ${iconColorClassName} ${darkMode ? 'opacity-80' : ''}`}>
                <span className="material-symbols-outlined text-2xl">medical_services</span>
                <span className="material-symbols-outlined -ml-2 text-2xl">shield</span>
              </div>
              <span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white/40' : 'text-[#020617]'}`}>120+</span>
            </div>
            <p className={`mx-auto max-w-[280px] text-sm font-semibold leading-relaxed ${footerTextClassName}`}>
              © 2024 120+. Всі права захищені.
              <br />
              Турбота про ваше здоров'я кожного дня.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
