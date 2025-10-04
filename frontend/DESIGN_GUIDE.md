# Women Self-Care Platform - Frontend Design Documentation

## Overview
This document describes the comprehensive, responsive frontend design for the Women Self-Care web platform with a Rural India theme.

## 🎨 Design Theme

### Color Palette
- **Primary Colors**
  - Maroon: `#8B1538` - Deep maroon for headers & CTAs
  - Pink: `#E91E63` - Earthy pink for highlights
  
- **Secondary Colors**
  - Turmeric Yellow: `#facc15` - For icons & positive actions
  - Leaf Green: `#4CAF50` - Success states & wellness
  - Sky Blue: `#03A9F4` - Information & links

- **Neutral Colors**
  - Off-white: `#FDFBF7` - Background
  - Cream: `#FAF7F2` - Card backgrounds
  - Charcoal: `#3E3E3E` - Primary text
  - Brown: `#5D4E37` - Secondary text

### Typography
- **English**: Poppins, Nunito
- **Hindi**: Noto Sans Devanagari
- **Base Size**: 16px (accessible for rural users)
- **Line Height**: 1.6 (improved readability)

## 📱 Layout Components

### 1. Navbar (Top Navigation)
**Mobile View:**
- Hamburger menu (left) → Opens sidebar
- Language selector (center) → Dropdown with EN/HI/TA
- Notification bell (right) → Shows notification count

**Desktop View:**
- Logo + App title (left)
- Quick action buttons (center): Chatbot, Meal Planner, Broadcast
- Language selector + Notifications (right)

### 2. Sidebar Menu
Accessible via hamburger menu, includes:
- User profile section with avatar and role
- Edit Profile
- Emergency Contacts
- Privacy & Security
- Settings
- Logout button (bottom)

### 3. Bottom Navigation (Mobile Only)
Fixed bottom bar with 3 main actions:
- 🤖 Chatbot - AI health assistant
- 🍽️ Meal Planner - Nutrition tracking
- 📻 Broadcast Room - Community sessions

### 4. Footer (Desktop Only)
- About Women SelfCare
- Quick links
- Contact information
- Copyright notice

## 🏠 Women Dashboard Sections

### 1. Welcome Section
- Personalized greeting with user name
- Current date in local format
- Weather-appropriate emoji

### 2. Upcoming Appointment Card
- Doctor name and specialty
- Appointment type and timing
- Location information
- Two action buttons:
  - **Status**: View/update health data
  - **Map**: Locate healthcare facility

### 3. Multimedia Content
- YouTube video embed or thumbnail
- Educational content about pregnancy/health
- Play button overlay
- Video title and duration

### 4. Complete Your Profile
- Progress bar showing completion percentage
- Prompt to add missing information
- CTA button to navigate to profile

### 5. Mythbuster & Education
- Card carousel/grid layout
- Each card shows:
  - ❌ Myth statement
  - ✓ Fact statement
  - Relevant emoji/icon
- "View All" link for more content

### 6. Health Widgets

**Vaccination Tracker:**
- List of upcoming and completed vaccinations
- Status indicators (completed/pending)
- Reminder notifications
- Link to full schedule

**Daily Diet Log:**
- Breakfast, Lunch, Dinner tracking
- Status for each meal (logged/pending)
- Quick "Log Meal" CTA
- Nutrition tips

### 7. Wellness Tips
- Grid of 4 tip cards
- Icon + Title + Description
- Topics: Iron-rich diet, Hydration, Exercise, Mental wellness

### 8. Community Activity Banner
- Featured live session information
- Speaker details and timing
- "Join Now" CTA for active sessions

## 📄 Additional Pages

### Map Page (`/map`)
- Interactive map showing nearby facilities
- List of nearest healthcare centers
- ASHA worker locations
- Contact information for each facility
- Navigation/directions feature

### Meal Planner Page (`/meal-planner`)
- Daily nutrition goals (calories, protein, iron, calcium)
- Meal breakdown (Breakfast, Lunch, Snack, Dinner)
- Ingredient lists
- Nutritionist tips
- Custom meal addition

### Broadcast Room Page (`/broadcast`)
Three tabs:
1. **Live Now**: Currently streaming sessions
2. **Upcoming**: Scheduled future sessions with reminders
3. **Recorded**: Archive of past sessions

Features:
- Live viewer count
- Session duration
- Speaker information
- Join/Watch buttons

## 🎯 Role-Based Variations

### Women (Base Layout)
- Focus on personal health tracking
- Pregnancy information
- Self-care content

### Family Layout (Planned)
- Family members' profiles
- Shared health status
- Family health tips
- Medical history access

### Doctor Layout (Planned)
- Patient dashboard
- Appointment management
- Patient progress tracking
- Content upload capability

### ASHA Worker Layout (Planned)
- Village map view
- Task list and follow-ups
- Broadcast room control
- Report submission

## 🎨 UI Components

### Cards
- Rounded corners (16-24px)
- Soft shadows
- Hover effects with scale
- Gradient backgrounds for emphasis

### Buttons
- **Primary**: Maroon background, white text
- **Secondary**: Yellow background, dark text
- **Outline**: Border with maroon color
- All buttons have rounded corners and hover effects

### Animations
- Slide up on page load
- Fade in for modals/dropdowns
- Smooth transitions (200-300ms)
- Pulse animation for live indicators

## 📱 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility Features
- High contrast mode support
- Large touch targets (min 44x44px)
- Keyboard navigation
- Screen reader friendly
- RTL support for future languages

## 🌐 Internationalization
Currently supports:
- English (en)
- Hindi (hi)
- Tamil (ta)

All UI strings use i18next for translation.

## 🚀 Performance Optimizations
- Lazy loading of routes
- Image optimization
- Font subsetting
- Code splitting
- Service worker for offline capability

## 📝 Implementation Notes

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **i18n**: react-i18next
- **Build Tool**: Vite

### File Structure
```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Icons.tsx
│       └── LoadingSpinner.tsx
├── pages/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── WomenDashboard.tsx
│   ├── map/
│   │   └── MapPage.tsx
│   ├── meal/
│   │   └── MealPlannerPage.tsx
│   └── broadcast/
│       └── BroadcastPage.tsx
├── locales/
│   ├── en.json
│   ├── hi.json
│   └── ta.json
├── index.css (Custom Tailwind config)
└── App.tsx
```

## 🎯 Next Steps

1. **Backend Integration**: Connect all pages to actual APIs
2. **Additional Roles**: Implement Family, Doctor, and ASHA layouts
3. **Real-time Features**: WebSocket for chat and broadcast
4. **Offline Mode**: PWA with offline data sync
5. **Analytics**: Track user engagement and feature usage
6. **Testing**: Unit tests and E2E tests
7. **Accessibility Audit**: WCAG 2.1 AA compliance

## 📞 Support
For questions or issues, contact the development team.

---
**Last Updated**: October 4, 2025
**Version**: 1.0.0
