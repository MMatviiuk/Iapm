# Deployment Checklist - Prescription Clarity

Complete checklist for deploying Prescription Clarity to production.

---

## Pre-Deployment

### Backend Setup

- [ ] **Clone Backend Repository**
  ```bash
  git clone https://github.com/icodebits/goit-capstone-project-g5
  cd goit-capstone-project-g5
  ```

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **Setup PostgreSQL Database**
  - [ ] Create database
  - [ ] Run migrations
  - [ ] Verify schema

- [ ] **Configure Environment Variables**
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `JWT_SECRET` - Random secure string
  - [ ] `JWT_EXPIRE` - Token expiration (e.g., '7d')
  - [ ] `EMAIL_HOST` - SMTP host
  - [ ] `EMAIL_PORT` - SMTP port
  - [ ] `EMAIL_USER` - SMTP username
  - [ ] `EMAIL_PASS` - SMTP password
  - [ ] `FRONTEND_URL` - Frontend URL for CORS
  - [ ] `NODE_ENV` - Set to 'production'

- [ ] **Test Backend Locally**
  ```bash
  npm start
  curl http://localhost:3000/api/health
  ```

### Frontend Setup

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **Create `.env` File**
  ```bash
  cp .env.example .env
  ```

- [ ] **Configure Environment Variables**
  - [ ] `VITE_API_URL` - Backend API URL
    - Development: `http://localhost:3000/api`
    - Production: `https://your-backend.com/api`

- [ ] **Test Frontend Locally**
  ```bash
  npm run dev
  # Open http://localhost:5173
  ```

- [ ] **Build for Production**
  ```bash
  npm run build
  # Verify dist/ folder created
  ```

---

## Testing

### Manual Testing

#### Authentication
- [ ] Landing page loads
- [ ] Click "Get Started" → Sign Up page
- [ ] Register new account
- [ ] Verify JWT token in localStorage
- [ ] Complete onboarding
- [ ] Logout
- [ ] Login with same credentials
- [ ] Verify auto-redirect to dashboard

#### Patient Features
- [ ] Dashboard displays correctly
- [ ] Navigate to "Today" page
- [ ] Add medication
  - [ ] Verify API call in Network tab
  - [ ] Verify medication appears in list
- [ ] Edit medication
  - [ ] Verify API call
  - [ ] Verify changes saved
- [ ] Delete medication
  - [ ] Verify API call
  - [ ] Verify medication removed
- [ ] Mark medication as taken
  - [ ] Verify API call
- [ ] View history
- [ ] Check achievements
- [ ] Test print schedule

#### Caregiver Features
- [ ] Switch to caregiver role
- [ ] Add dependent
  - [ ] Fill name, DOB, relationship
  - [ ] Verify API call
  - [ ] Verify dependent appears
- [ ] View analytics
- [ ] Check adherence stats

#### Doctor Features
- [ ] Switch to doctor role
- [ ] Invite patient
  - [ ] Enter email
  - [ ] Verify API call
  - [ ] Check email received (if configured)
- [ ] View patients list
- [ ] Check analytics
- [ ] Browse medication database

#### Responsive Design
- [ ] Test on mobile (390px)
  - [ ] TopBar visible
  - [ ] Bottom navigation works
  - [ ] All features accessible
- [ ] Test on tablet (768px)
  - [ ] Layout adapts properly
- [ ] Test on desktop (1440px)
  - [ ] Sidebar visible
  - [ ] No bottom navigation
  - [ ] All features accessible

#### Dark Mode
- [ ] Toggle dark mode
- [ ] Verify all pages
- [ ] Check contrast
- [ ] Test in mobile and desktop

#### Error Handling
- [ ] Simulate network error
  - [ ] Stop backend
  - [ ] Try adding medication
  - [ ] Verify error toast
- [ ] Invalid credentials
  - [ ] Wrong password
  - [ ] Verify error message
- [ ] Expired token
  - [ ] Manually expire token
  - [ ] Try API call
  - [ ] Verify redirect to login

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] No console warnings

---

## Backend Deployment

### Option 1: Render

1. **Create Account**
   - [ ] Sign up at render.com

2. **Create Web Service**
   - [ ] Connect GitHub repo
   - [ ] Select backend repo
   - [ ] Choose region

3. **Configure Build**
   - [ ] Build Command: `npm install`
   - [ ] Start Command: `npm start`

4. **Environment Variables**
   - [ ] Add all required env vars
   - [ ] Generate new JWT_SECRET

5. **Create PostgreSQL Database**
   - [ ] Create new PostgreSQL
   - [ ] Note connection string
   - [ ] Add to web service env

6. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build
   - [ ] Verify deployment

7. **Test**
   - [ ] Visit backend URL
   - [ ] Check /api/health endpoint
   - [ ] Test register/login

### Option 2: Railway

1. **Create Account**
   - [ ] Sign up at railway.app

2. **Create Project**
   - [ ] New Project
   - [ ] Deploy from GitHub repo

3. **Add PostgreSQL**
   - [ ] Add PostgreSQL database
   - [ ] Note credentials

4. **Configure Service**
   - [ ] Set environment variables
   - [ ] Set start command

5. **Deploy**
   - [ ] Trigger deploy
   - [ ] Monitor logs

6. **Test**
   - [ ] Check deployment URL
   - [ ] Test API endpoints

### Option 3: Heroku

1. **Create Account**
   - [ ] Sign up at heroku.com

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   # Add other vars
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Test**
   ```bash
   heroku open
   heroku logs --tail
   ```

---

## Frontend Deployment

### Option 1: Vercel

1. **Create Account**
   - [ ] Sign up at vercel.com

2. **Import Project**
   - [ ] Click "New Project"
   - [ ] Import GitHub repo
   - [ ] Select frontend folder

3. **Configure Build**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install`

4. **Environment Variables**
   - [ ] Add `VITE_API_URL`
   - [ ] Set to deployed backend URL

5. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build

6. **Test**
   - [ ] Visit deployment URL
   - [ ] Test all features

### Option 2: Netlify

1. **Create Account**
   - [ ] Sign up at netlify.com

2. **Import Project**
   - [ ] Click "New site from Git"
   - [ ] Connect GitHub
   - [ ] Select repo

3. **Configure Build**
   - [ ] Build command: `npm run build`
   - [ ] Publish directory: `dist`

4. **Environment Variables**
   - [ ] Go to Site Settings
   - [ ] Build & Deploy → Environment
   - [ ] Add `VITE_API_URL`

5. **Deploy**
   - [ ] Trigger deploy

6. **Configure SPA Routing**
   - [ ] Create `_redirects` file:
     ```
     /* /index.html 200
     ```

7. **Test**
   - [ ] Visit site URL
   - [ ] Test navigation

---

## Post-Deployment

### DNS Configuration

- [ ] **Custom Domain** (if applicable)
  - [ ] Add domain to hosting provider
  - [ ] Configure DNS records
  - [ ] Enable HTTPS/SSL
  - [ ] Verify certificate

### Security

- [ ] **HTTPS Enabled**
  - [ ] Frontend uses HTTPS
  - [ ] Backend uses HTTPS
  - [ ] Mixed content warnings resolved

- [ ] **CORS Configured**
  - [ ] Backend allows frontend origin
  - [ ] No CORS errors in console

- [ ] **Environment Variables**
  - [ ] No sensitive data in code
  - [ ] All secrets in env vars
  - [ ] JWT_SECRET is strong

- [ ] **Rate Limiting** (Backend)
  - [ ] API rate limiting enabled
  - [ ] Protect against abuse

### Monitoring

- [ ] **Error Tracking**
  - [ ] Sentry configured (optional)
  - [ ] Error notifications setup

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar
  - [ ] Alert on downtime

- [ ] **Analytics**
  - [ ] Google Analytics (optional)
  - [ ] User flow tracking

### Database

- [ ] **Backups**
  - [ ] Automated backups enabled
  - [ ] Backup schedule configured
  - [ ] Test restore process

- [ ] **Scaling**
  - [ ] Connection pooling enabled
  - [ ] Index optimization
  - [ ] Query performance monitored

---

## Final Verification

### Functionality

- [ ] User can register
- [ ] User can login
- [ ] User can add medication
- [ ] User can edit medication
- [ ] User can delete medication
- [ ] User can mark medication taken
- [ ] Caregiver can add dependent
- [ ] Doctor can invite patient
- [ ] Analytics display correctly
- [ ] Dark mode works
- [ ] Print works
- [ ] All pages accessible

### Performance

- [ ] Page load < 3 seconds
- [ ] No JavaScript errors
- [ ] No CSS issues
- [ ] Images load properly
- [ ] API responses < 1 second

### Mobile

- [ ] Responsive on all screen sizes
- [ ] Touch targets 44px+
- [ ] Text readable (18px+)
- [ ] Navigation works
- [ ] Forms submittable

### SEO (if applicable)

- [ ] Meta tags set
- [ ] Title tags descriptive
- [ ] Open Graph tags
- [ ] Sitemap generated
- [ ] robots.txt configured

---

## Launch

### Pre-Launch

- [ ] **Announcement**
  - [ ] Prepare launch email
  - [ ] Social media posts ready
  - [ ] Landing page live

- [ ] **Documentation**
  - [ ] User guide available
  - [ ] FAQ page created
  - [ ] Support email setup

- [ ] **Legal**
  - [ ] Privacy policy live
  - [ ] Terms of service live
  - [ ] Cookie consent (if needed)

### Launch Day

- [ ] **Go Live**
  - [ ] Deploy production build
  - [ ] Verify all systems operational
  - [ ] Monitor error logs

- [ ] **Communication**
  - [ ] Send launch email
  - [ ] Post on social media
  - [ ] Notify stakeholders

- [ ] **Monitoring**
  - [ ] Watch server metrics
  - [ ] Monitor error rates
  - [ ] Track user sign-ups

### Post-Launch

- [ ] **First 24 Hours**
  - [ ] Monitor closely
  - [ ] Fix critical bugs immediately
  - [ ] Respond to user feedback

- [ ] **First Week**
  - [ ] Collect user feedback
  - [ ] Analyze usage patterns
  - [ ] Plan improvements

- [ ] **First Month**
  - [ ] Review analytics
  - [ ] Implement quick wins
  - [ ] Plan next features

---

## Rollback Plan

### If Critical Issue Occurs

1. **Identify Issue**
   - [ ] Check error logs
   - [ ] Identify affected users

2. **Rollback Frontend**
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   # Use UI to rollback deployment
   ```

3. **Rollback Backend**
   ```bash
   # Render/Railway
   # Use UI to deploy previous version
   
   # Heroku
   heroku rollback
   ```

4. **Notify Users**
   - [ ] Status page update
   - [ ] Email if necessary

5. **Fix and Redeploy**
   - [ ] Fix issue locally
   - [ ] Test thoroughly
   - [ ] Deploy again

---

## Maintenance

### Weekly

- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor uptime
- [ ] Check database performance

### Monthly

- [ ] Update dependencies
- [ ] Security audit
- [ ] Backup verification
- [ ] Performance review

### Quarterly

- [ ] User feedback review
- [ ] Feature planning
- [ ] Infrastructure review
- [ ] Cost optimization

---

## Support

### User Support

- [ ] **Support Email**
  - [ ] support@yourapp.com setup
  - [ ] Auto-responder configured

- [ ] **Help Center**
  - [ ] FAQ page
  - [ ] Video tutorials
  - [ ] Contact form

- [ ] **Community**
  - [ ] Discord/Slack (optional)
  - [ ] User forum

### Technical Support

- [ ] **Documentation**
  - [ ] API docs
  - [ ] Integration guide
  - [ ] Architecture docs

- [ ] **Status Page**
  - [ ] status.yourapp.com
  - [ ] Incident updates

---

## Success Metrics

### Track These KPIs

- [ ] **Users**
  - Daily active users
  - Weekly active users
  - Monthly active users

- [ ] **Engagement**
  - Medications added per user
  - Login frequency
  - Feature usage

- [ ] **Performance**
  - API response time
  - Page load time
  - Error rate

- [ ] **Business**
  - Sign-up rate
  - Retention rate
  - Conversion rate (if paid)

---

## Congratulations! 🎉

If you've checked all items, your Prescription Clarity app is:

✅ Fully deployed  
✅ Secure and monitored  
✅ Ready for users  
✅ Production-ready  

**Next:** Focus on user acquisition and feature development!

---

## Quick Reference

### Frontend URL
```
Development: http://localhost:5173
Production:  https://your-frontend.vercel.app
```

### Backend URL
```
Development: http://localhost:3000
Production:  https://your-backend.render.com
```

### GitHub Repositories
```
Frontend: [Your Frontend Repo]
Backend:  https://github.com/icodebits/goit-capstone-project-g5
```

### Support Contacts
```
Technical:  tech@yourapp.com
Support:    support@yourapp.com
Emergency:  [Your Phone]
```

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  
**Next Review:** After first deployment
