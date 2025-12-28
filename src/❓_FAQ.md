# ❓ Frequently Asked Questions (FAQ)

## Quick Answers to Common Questions

---

## 🚀 Getting Started

### Q: How do I start the application?
**A:** Three simple steps:
1. Run `npm run prepare-db` (or `copy-database.bat` on Windows)
2. Run `npm run dev`
3. Open http://localhost:5173

**Full guide:** `⚡_START_HERE_NOW.md`

---

### Q: What are the demo account credentials?
**A:** 
- **Patient:** patient@demo.com / demo123
- **Caregiver:** caregiver@demo.com / demo123
- **Doctor:** doctor@demo.com / demo123

---

### Q: I'm getting "HTTP 404" error. What should I do?
**A:** The database file isn't in the right place. Run:
```bash
npm run prepare-db
npm run dev
```

**Detailed fix:** `🚨_FIX_APP_NOW.md`

---

### Q: Why do I need to copy the database?
**A:** Vite (the build tool) only serves files from the `public/` folder. The database is in `data/` folder, so it needs to be copied to `public/data/` to be accessible via HTTP.

---

## 🛠️ Technical Questions

### Q: Do I need a backend server?
**A:** No! The app uses a Mock API that stores data in `localStorage`. It works completely without a backend for demo purposes.

To connect a real backend:
1. Create `.env` file
2. Set `VITE_API_URL=your-backend-url`
3. Change `USE_MOCK_API = false` in `services/api.ts`

---

### Q: What technologies does this use?
**A:**
- **Frontend:** React 18.3 + TypeScript
- **Build Tool:** Vite 5.2
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Shadcn UI (Radix UI)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (motion/react)

---

### Q: Does it work on mobile?
**A:** Yes! The app is fully responsive and works on:
- 📱 Mobile phones (375px+)
- 📱 Tablets (640px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1920px+)

---

### Q: Does it support dark mode?
**A:** Yes! Toggle dark mode in Settings or it follows system preferences.

---

### Q: Is it accessible for elderly users?
**A:** Yes! Designed specifically for elderly users:
- Large buttons (48-60px)
- Large text (18px base)
- High contrast
- Simple navigation
- Clear visual feedback

**Details:** `ELDERLY_FRIENDLY_OPTIMIZATION.md`

---

## 🐛 Troubleshooting

### Q: The app shows a blank page. What's wrong?
**A:** Check browser console (F12 → Console):
1. If "HTTP 404" → Run `npm run prepare-db`
2. If "Module not found" → Run `npm install`
3. If no errors → Clear browser cache

---

### Q: I get "Port 5173 is already in use"
**A:** 
**Option 1:** Kill the existing process
```bash
# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Option 2:** Use different port
```bash
npm run dev -- --port 5174
```

---

### Q: Build fails with "Expected ';' but found ':'"
**A:** Old build cache issue. Clear it:
```bash
rm -rf dist node_modules/.vite
npm run dev
```

---

### Q: Login doesn't work
**A:** 
1. Make sure you're using demo credentials exactly:
   - Email: `patient@demo.com`
   - Password: `demo123`
2. Clear browser localStorage (F12 → Application → Local Storage → Clear)
3. Try incognito/private mode

---

### Q: Charts don't render
**A:** Recharts might not be installed:
```bash
npm install
npm run dev
```

---

## 📚 Documentation

### Q: Which documentation file should I read?
**A:** Depends on your goal:
- **Quick start:** `⚡_START_HERE_NOW.md`
- **App broken:** `🚨_FIX_APP_NOW.md`
- **Full overview:** `README.md`
- **Development:** `guidelines/Guidelines.md`
- **Not sure:** `📖_WHICH_FILE_TO_READ.md`

---

### Q: How many documentation files are there?
**A:** 150+ files covering everything from quick fixes to detailed technical architecture. See `📋_MASTER_INDEX.md` for complete list.

---

### Q: Documentation is in multiple languages?
**A:** Yes! Critical files have Ukrainian translations:
- `🔥_ПРОЧИТАЙ_СПОЧАТКУ.md` (Ukrainian emergency guide)
- `👉_ЧИТАЙ_МЕНЕ.txt` (Ukrainian quick reference)
- Most technical docs are in English

---

## 🎨 Features

### Q: What features does the app have?
**A:**
- **Patient Role:**
  - Medication tracking
  - Daily schedule
  - Week view calendar
  - History tracking
  - Achievement system
  - Analytics dashboard
  - Print schedule

- **Caregiver Role:**
  - Manage multiple dependents
  - View their medications
  - Track adherence
  - Analytics

- **Doctor Role:**
  - Manage patients
  - Cohort analytics
  - At-risk patient alerts
  - Medication database

---

### Q: Can I add my own medications?
**A:** Yes! Click "Add Medication" button and fill in:
- Medication name
- Dosage
- Frequency
- Times
- Meal timing
- Duration
- Notes

---

### Q: Can I print my medication schedule?
**A:** Yes! Go to Settings → Print Schedule. Opens print-friendly view.

---

### Q: Can I upload photos?
**A:** Yes! You can upload:
- Profile photos
- Medication photos
- Maximum 5MB per photo

**Details:** `PHOTO_UPLOAD_FEATURE_COMPLETE.md`

---

### Q: Can I share my medication list?
**A:** Yes! Use Share Profile feature to generate a shareable link for caregivers.

---

## 🔒 Security & Privacy

### Q: Is my data secure?
**A:** 
- Demo mode: Data stored locally in browser (localStorage)
- Production mode: All data encrypted, GDPR & HIPAA compliant

**Details:** `GDPR_HIPAA_UNIFIED_NOV5_2025.md`

---

### Q: Is this HIPAA compliant?
**A:** Yes! When connected to proper backend. Includes:
- Data encryption
- Access logging
- Role-based permissions
- Audit trails

---

### Q: Where is my data stored?
**A:** 
- **Demo mode:** Browser localStorage (your device only)
- **Production:** Encrypted database on secure servers

---

## 👨‍💻 Development

### Q: Can I contribute to the project?
**A:** Yes! Read:
1. `guidelines/Guidelines.md` - Development guidelines
2. `ARCHITECTURE.md` - Technical architecture
3. Make your changes
4. Submit pull request

---

### Q: How do I set up development environment?
**A:**
```bash
git clone <repository>
cd prescription-clarity
npm install
npm run prepare-db
npm run dev
```

**Full guide:** `DEVELOPER_QUICKSTART.md`

---

### Q: What's the project structure?
**A:**
```
/components     - React components
/services       - API service
/utils          - Utility functions
/types          - TypeScript types
/data           - Database files
/styles         - Global styles
/guidelines     - Development docs
```

**Details:** `ARCHITECTURE.md`

---

### Q: How do I add a new feature?
**A:**
1. Read `guidelines/Guidelines.md`
2. Create component in `/components`
3. Add route in `App.tsx`
4. Test thoroughly
5. Update documentation

---

### Q: How do I run tests?
**A:** See `TESTING_GUIDE.md` for:
- Unit tests
- Integration tests
- E2E tests
- Manual testing checklist

---

## 🌍 Deployment

### Q: How do I deploy to production?
**A:**
```bash
npm run build
```

Then deploy `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

**Guide:** `DEPLOYMENT_CHECKLIST.md`

---

### Q: What environment variables do I need?
**A:**
```env
VITE_API_URL=https://api.yoursite.com/api
```

Create `.env` file from `.env.example`

---

## 📊 Data & Analytics

### Q: How is adherence calculated?
**A:** 
```
Adherence = (Medications Taken / Medications Scheduled) × 100
```

Tracked over various time periods (daily, weekly, monthly).

---

### Q: What analytics are available?
**A:**
- Adherence trends
- Missed doses
- Medication schedules
- Patient progress (for doctors)
- At-risk alerts

---

### Q: Can I export data?
**A:** Yes! Features planned:
- CSV export
- PDF reports
- Email reports

---

## 🎯 Roles

### Q: What's the difference between roles?
**A:**

**Patient:**
- Manage own medications
- Track personal adherence
- View own data only

**Caregiver:**
- Manage multiple dependents
- View their medications
- Track their adherence
- Receive notifications

**Doctor:**
- Manage multiple patients
- View cohort analytics
- Access medication database
- Identify at-risk patients

---

### Q: Can I switch between roles?
**A:** Yes! Click user menu → "Switch Role" to test different views with same account.

**Guide:** `ROLE_SWITCHING_GUIDE.md`

---

### Q: Can one user have multiple roles?
**A:** Not currently, but planned for future versions.

---

## 🆘 Still Need Help?

### Q: Where can I get more help?
**A:**
- **Quick fixes:** `🚨_FIX_APP_NOW.md`
- **Diagnostic:** `🔧_DIAGNOSTIC.md`
- **Full docs:** `README.md`
- **Master index:** `📋_MASTER_INDEX.md`
- **GitHub Issues:** https://github.com/icodebits/goit-capstone-project-g5/issues

---

### Q: Who do I contact?
**A:**
- **Author:** [MMatviiuk](https://github.com/MMatviiuk)
- **Project:** [Prescription Clarity](https://github.com/icodebits/goit-capstone-project-g5)

---

## 💡 Pro Tips

- Always run `npm run dev`, not just `vite`
- Database is auto-copied on dev server start
- Use Debug Panel (Development mode only) for quick navigation
- Test with all three roles for full experience
- Check console (F12) for detailed error messages

---

**Last Updated:** November 5, 2025  
**Version:** 2.0.0
