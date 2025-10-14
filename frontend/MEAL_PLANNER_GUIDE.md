# 📋 Daily Meal Recommendation System - Complete Guide

## 🎯 Overview

The Daily Meal Recommendation System is a comprehensive AI-powered feature that provides personalized, nutritionally-balanced meal plans for pregnant women. The system generates multiple meal options for each meal type (breakfast, lunch, dinner, snacks) with detailed nutrition information, preparation steps, and health benefits.

---

## ✨ Key Features

### **1. AI-Powered Recommendations**
- 🤖 Google Gemini AI generates personalized meals
- 🎯 Context-aware based on user profile and pregnancy stage
- 📊 Comprehensive nutrition calculations
- 🌍 Cultural and regional food preferences

### **2. Daily Meal Plans**
- 📅 Auto-generate daily recommendations
- 🔄 Multiple options per meal type
- ❤️ Select favorite meals
- 📈 Track nutrition progress

### **3. Nutrition Tracking**
- 🔢 Real-time nutrition calculation
- 📊 Progress towards daily goals
- 🎯 Key nutrients for pregnancy:
  - Calories
  - Protein
  - Iron
  - Calcium
  - Folate
  - Vitamin D
  - Omega-3
  - Fiber

### **4. Complete CRUD Operations**
- ✅ **Create**: Generate new meal plans
- 📖 **Read**: View today's plan and history
- ✏️ **Update**: Select/deselect meal suggestions
- 🗑️ **Delete**: Remove old meal plans

### **5. User Interface**
- 🎨 Beautiful, intuitive design
- 📱 Fully responsive
- 🔍 Search and filter history
- 🎭 Expandable meal details
- 🌟 Selection indicators

---

## 🏗️ Architecture

### **Frontend Components**

```
frontend/src/
├── pages/meal/
│   └── MealPlannerPage.tsx          # Main page with all features
├── components/meal/
│   ├── MealRecommendationCard.tsx   # Individual meal card
│   └── MealPlanHistory.tsx          # History view with filters
├── services/
│   └── mealService.ts               # API calls to backend
└── types/
    └── meal.ts                      # TypeScript types
```

### **Backend Services**

```
backend/services/meal-planner-service/
├── src/
│   ├── controllers/
│   │   └── mealPlanner.controller.ts
│   ├── routes/
│   │   └── mealPlanner.routes.ts
│   └── services/
│       ├── mealPlannerService.ts     # Main orchestration
│       ├── geminiService.ts          # AI integration
│       ├── databaseService.ts        # Database operations
│       ├── personalizationService.ts # Context building
│       └── learningService.ts        # User preferences
└── prisma/
    └── schema.prisma                 # Database schema
```

---

## 🎨 User Interface Guide

### **1. Today's Plan View**

#### **Header Section**
```
┌─────────────────────────────────────────────────────────┐
│  🍽️ Meal Planner                                        │
│                                    [Today] [History]    │
│                            [Auto Load] [Generate New]   │
└─────────────────────────────────────────────────────────┘
```

#### **Nutrition Progress Card**
Shows real-time nutrition from selected meals:
```
┌─────────────────────────────────────────────────────────┐
│  Today's Nutrition Progress                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │1200│ │ 45g│ │15mg│ │600mg│ │400│ │10mcg│          │
│  │/2200│ │/75g│ │/27mg│ │/1200│ │/600│ │/15 │         │
│  │cal │ │Prot│ │Iron│ │Calc│ │Fola│ │VitD│            │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           │
└─────────────────────────────────────────────────────────┘
```

#### **Meal Recommendation Cards**
Each meal type (Breakfast, Lunch, Dinner, Snack) shows:
- 🍽️ Meal name and type badge
- ✅ Selection indicator
- ❤️ Select/deselect button
- 📊 Nutrition quick view (4 key nutrients)
- ✓ Key benefits
- 🔽 Expandable details:
  - Complete nutrition facts
  - 💡 Did you know facts
  - 👨‍🍳 Preparation steps

### **2. History View**

#### **Filter Controls**
```
┌─────────────────────────────────────────────────────────┐
│  🔍 [Search meal plans or meals...]                     │
│  Filter: [All Plans] [Recent (7 days)] [With Selections]│
└─────────────────────────────────────────────────────────┘
```

#### **Meal Plan List**
Each plan shows:
- 📅 Date with "TODAY" badge if applicable
- ✅ Selection count
- 📊 Meal type counts
- 🗑️ Delete button
- 🔽 Expand to view all meals

---

## 🔧 Frontend Implementation

### **1. Main Page - MealPlannerPage.tsx**

#### **State Management**
```typescript
const [view, setView] = useState<'today' | 'history'>('today');
const [todayPlan, setTodayPlan] = useState<MealPlan | null>(null);
const [allPlans, setAllPlans] = useState<MealPlan[]>([]);
const [loading, setLoading] = useState(true);
const [generating, setGenerating] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
```

#### **Key Functions**

**Generate New Plan**
```typescript
const handleGeneratePlan = async () => {
  setGenerating(true);
  try {
    const userProfile = 'Pregnant woman in second trimester';
    const newPlan = await mealService.generateMealPlan(user.id, userProfile);
    setTodayPlan(newPlan);
    setSuccess('Daily meal plan generated successfully! 🎉');
  } catch (err) {
    setError(err.message);
  } finally {
    setGenerating(false);
  }
};
```

**Auto-Load Today's Plan**
```typescript
const handleAutoGenerate = async () => {
  const plan = await mealService.autoGenerateTodayPlan(user.id, userProfile);
  setTodayPlan(plan);
};
```

**Select/Deselect Meal**
```typescript
const handleSelectSuggestion = async (suggestionId: string, isSelected: boolean) => {
  await mealService.updateSuggestionSelection(suggestionId, isSelected);
  // Update local state to reflect change
};
```

**Delete Meal Plan**
```typescript
const handleDeletePlan = async (planId: string) => {
  if (!confirm('Are you sure?')) return;
  await mealService.deleteMealPlan(planId);
  // Remove from local state
};
```

**Calculate Nutrition Progress**
```typescript
const calculateCurrentNutrition = (): NutritionInfo | null => {
  const selected = todayPlan.suggestions.filter(s => s.isSelected);
  return selected.reduce((acc, s) => ({
    calories: acc.calories + s.parsedContent.nutrition.calories,
    protein: acc.protein + s.parsedContent.nutrition.protein,
    // ... other nutrients
  }), initialNutrition);
};
```

### **2. API Service - mealService.ts**

#### **Available Methods**

```typescript
// Generate new meal plan
generateMealPlan(userId: string, userProfile?: string): Promise<MealPlan>

// Get specific meal plan
getMealPlanById(id: string): Promise<MealPlan>

// Get all user meal plans
getUserMealPlans(limit: number): Promise<MealPlan[]>

// Get today's meal plan
getTodayMealPlan(): Promise<MealPlan | null>

// Update meal suggestion selection
updateSuggestionSelection(suggestionId: string, isSelected: boolean): Promise<void>

// Delete meal plan
deleteMealPlan(id: string): Promise<void>

// Check if needs daily recommendation
needsDailyRecommendation(): Promise<boolean>

// Auto-generate if needed
autoGenerateTodayPlan(userId: string, userProfile?: string): Promise<MealPlan | null>
```

#### **Usage Example**

```typescript
import * as mealService from '@/services/mealService';

// Generate meal plan
const plan = await mealService.generateMealPlan('user123', 'Second trimester');

// Get today's plan
const todayPlan = await mealService.getTodayMealPlan();

// Select a meal
await mealService.updateSuggestionSelection('suggestion123', true);

// Delete a plan
await mealService.deleteMealPlan('plan123');
```

### **3. Components**

#### **MealRecommendationCard.tsx**

**Props:**
```typescript
interface MealRecommendationCardProps {
  suggestion: MealSuggestion;
  onSelect?: (suggestionId: string, isSelected: boolean) => void;
  showActions?: boolean;
}
```

**Features:**
- Expandable details
- Select/deselect button
- Nutrition display
- Benefits and preparation steps

**Usage:**
```tsx
<MealRecommendationCard
  suggestion={suggestion}
  onSelect={handleSelect}
  showActions={true}
/>
```

#### **MealTypeSection.tsx**

Groups and displays all suggestions for a meal type:

```tsx
<MealTypeSection
  mealType="BREAKFAST"
  suggestions={allSuggestions}
  onSelect={handleSelect}
  showActions={true}
/>
```

#### **MealPlanHistory.tsx**

**Props:**
```typescript
interface MealPlanHistoryProps {
  mealPlans: MealPlan[];
  onDelete?: (planId: string) => void;
  onSelect?: (suggestionId: string, isSelected: boolean) => void;
}
```

**Features:**
- Search functionality
- Filter by time period
- Filter by selections
- Expandable meal plans
- Delete capability

---

## 🔌 Backend API Reference

### **Base URL**
```
Via API Gateway: http://localhost:3000/api/mealplanner
Direct Service: http://localhost:3005
```

### **Endpoints**

#### **1. Generate Meal Plan**
```http
POST /api/mealplanner/generate
```

**Request:**
```json
{
  "userId": "user123",
  "userProfile": "Pregnant woman in second trimester",
  "title": "Daily Meal Plan"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal plan generated successfully",
  "data": {
    "id": "plan123",
    "userId": "user123",
    "title": "Daily Meal Plan",
    "date": "2025-10-11T00:00:00.000Z",
    "isActive": true,
    "suggestions": [
      {
        "id": "sugg1",
        "type": "BREAKFAST",
        "content": "{...}",
        "parsedContent": {
          "name": "Vegetable Poha with Peanuts",
          "why": "Rich in iron and folate...",
          "benefits": ["Prevents anemia", "..."],
          "facts": ["Poha is low in calories..."],
          "steps": ["Wash poha...", "..."],
          "nutrition": {
            "calories": 320,
            "protein": 12,
            "iron": 4.5,
            "calcium": 45,
            "folate": 85,
            "vitaminD": 0,
            "omega3": 150,
            "carbohydrates": 52,
            "fats": 8,
            "fiber": 6,
            "servingSize": "1 plate (200g)"
          }
        },
        "isSelected": false,
        "orderIndex": 0
      }
    ]
  }
}
```

#### **2. Get Meal Plan by ID**
```http
GET /api/mealplanner/:id
```

**Response:** Same as generate response

#### **3. Get User's Meal Plans**
```http
GET /api/mealplanner?limit=30
```

**Response:**
```json
{
  "success": true,
  "data": [ /* Array of meal plans */ ]
}
```

#### **4. Update Suggestion Selection**
```http
PUT /api/mealplanner/suggestion/:suggestionId
```

**Request:**
```json
{
  "isSelected": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Suggestion updated successfully"
}
```

#### **5. Delete Meal Plan**
```http
DELETE /api/mealplanner/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Meal plan deleted successfully"
}
```

---

## 💡 Usage Scenarios

### **Scenario 1: Daily Morning Routine**

**User Story:** User opens app in the morning and wants today's recommendations.

**Flow:**
1. User navigates to Meal Planner page
2. Clicks "Auto Load" button
3. System checks if today's plan exists:
   - If YES: Loads existing plan
   - If NO: Generates new plan automatically
4. User views meal options
5. User selects preferred meals
6. Nutrition progress updates in real-time

**Code:**
```typescript
// In MealPlannerPage.tsx
const handleAutoGenerate = async () => {
  const plan = await mealService.autoGenerateTodayPlan(user.id, userProfile);
  setTodayPlan(plan);
};
```

### **Scenario 2: Custom Meal Plan Generation**

**User Story:** User wants fresh recommendations, even if today's plan exists.

**Flow:**
1. User clicks "Generate New Plan"
2. System calls AI to create new suggestions
3. New plan replaces today's plan
4. User can compare with history

**Code:**
```typescript
const handleGeneratePlan = async () => {
  const newPlan = await mealService.generateMealPlan(user.id, userProfile);
  setTodayPlan(newPlan);
};
```

### **Scenario 3: Reviewing Past Plans**

**User Story:** User wants to see what worked well last week.

**Flow:**
1. User switches to "History" view
2. User filters by "With Selections"
3. User searches for specific meals
4. User expands past plans to see details
5. User can re-select meals from history

**Code:**
```typescript
// In MealPlanHistory.tsx
const filteredPlans = mealPlans.filter((plan) => {
  if (filterType === 'selected') {
    return plan.suggestions.some(s => s.isSelected);
  }
  if (searchQuery) {
    return plan.suggestions.some(s => 
      s.parsedContent.name.toLowerCase().includes(searchQuery)
    );
  }
  return true;
});
```

### **Scenario 4: Tracking Nutrition**

**User Story:** User wants to ensure meeting daily nutrition goals.

**Flow:**
1. User views Today's Plan
2. Nutrition Progress card shows 0/goals initially
3. User selects breakfast option
4. Progress updates: 320 cal / 2200 cal
5. User continues selecting meals
6. Progress fills up towards 100%

**Code:**
```typescript
const calculateCurrentNutrition = () => {
  const selected = todayPlan.suggestions.filter(s => s.isSelected);
  return selected.reduce((acc, s) => ({
    calories: acc.calories + s.parsedContent.nutrition.calories,
    // ... sum all nutrients
  }), initialNutrition);
};
```

---

## 🎨 Button & Feature Reference

### **Main Actions**

| Button | Location | Function | When to Use |
|--------|----------|----------|-------------|
| **Auto Load** | Today's View, Header | Loads existing plan or generates new | Morning routine, quick access |
| **Generate New Plan** | Today's View, Header | Force generate fresh recommendations | Want new options |
| **❤️ Select** | Meal Card | Mark meal as selected | Choose preferred meal |
| **✅ Selected** | Meal Card | Deselect meal | Change selection |
| **Show More Details** | Meal Card, Bottom | Expand full nutrition & steps | Need more info |
| **Show Less** | Expanded Card | Collapse details | Done reading |
| **🗑️ Delete** | History View, Each Plan | Remove old plan | Cleanup history |

### **View Toggle**

| View | Purpose | Shows |
|------|---------|-------|
| **Today's Plan** | Focus on current day | Today's meals, nutrition progress |
| **History** | Review past plans | All plans with filters & search |

### **Filter Options (History)**

| Filter | Purpose | Shows |
|--------|---------|-------|
| **All Plans** | See everything | All meal plans |
| **Recent (7 days)** | Recent activity | Last week's plans |
| **With Selections** | Find favorites | Plans with selected meals |

---

## 🔔 Automatic Daily Recommendations

### **How It Works**

The system can automatically generate daily meal plans in two ways:

#### **1. Manual Auto-Load (Current)**
- User clicks "Auto Load" button
- System checks for today's plan
- If doesn't exist, generates automatically
- If exists, loads from database

#### **2. Automatic Background Generation (Future Enhancement)**

**Implementation Plan:**

**Backend Cron Job:**
```typescript
// backend/services/meal-planner-service/src/scheduler.ts
import cron from 'node-cron';

// Run every day at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  const activeUsers = await getActiveUsers();
  
  for (const user of activeUsers) {
    const hasToday = await checkTodayPlan(user.id);
    if (!hasToday) {
      await generateDailyMealPlan(user.id, user.profile);
      await sendNotification(user.id, 'Your daily meal plan is ready!');
    }
  }
});
```

**Frontend Notification:**
```typescript
// When user opens app
useEffect(() => {
  const checkNewPlan = async () => {
    const plan = await mealService.getTodayMealPlan();
    if (plan && isNewToday(plan)) {
      showNotification('🎉 Today\'s meal plan is ready!');
    }
  };
  checkNewPlan();
}, []);
```

---

## 📊 Database Schema

### **MealPlan Table**
```prisma
model MealPlan {
  id          String    @id @default(cuid())
  userId      String
  title       String    @default("Daily Meal Plan")
  date        DateTime  @default(now())
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(...)
  suggestions MealSuggestion[]
}
```

### **MealSuggestion Table**
```prisma
model MealSuggestion {
  id          String    @id @default(cuid())
  mealPlanId  String
  type        MealType  // BREAKFAST, LUNCH, DINNER, SNACK
  content     String    // JSON with meal details
  orderIndex  Int       @default(0)
  isSelected  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  
  mealPlan    MealPlan  @relation(...)
}
```

---

## 🚀 Quick Start Guide

### **For Users**

1. **First Time:**
   - Navigate to Meal Planner
   - Click "Generate New Plan"
   - Wait 10-15 seconds for AI
   - Explore meal options

2. **Daily Use:**
   - Click "Auto Load"
   - Select preferred meals
   - Check nutrition progress
   - Meet daily goals

3. **Review History:**
   - Switch to "History" view
   - Filter and search
   - Find favorite meals
   - Reference past plans

### **For Developers**

1. **Setup:**
   ```bash
   # Backend
   cd backend/services/meal-planner-service
   npm install
   npm run dev
   
   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

2. **Test API:**
   ```powershell
   # Generate plan
   $token = "YOUR_JWT_TOKEN"
   $body = @{ userId = "user123"; userProfile = "Second trimester" } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:3000/api/mealplanner/generate" `
     -Method Post `
     -Body $body `
     -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
   ```

3. **Debug:**
   - Check browser console for errors
   - Check terminal for API errors
   - Verify JWT token is valid
   - Ensure services are running

---

## 🎯 Best Practices

### **Performance**
- ✅ Cache today's plan in state
- ✅ Only fetch when needed
- ✅ Use loading states
- ✅ Debounce search input

### **UX**
- ✅ Show loading spinners
- ✅ Display error messages
- ✅ Confirm before delete
- ✅ Auto-dismiss success messages
- ✅ Real-time nutrition updates

### **Data Management**
- ✅ Parse JSON content on load
- ✅ Keep local state in sync
- ✅ Handle edge cases (no data)
- ✅ Validate user input

### **Security**
- ✅ Always use JWT tokens
- ✅ Validate user ID
- ✅ Check authentication
- ✅ Sanitize inputs

---

## 🐛 Troubleshooting

### **Common Issues**

**1. "No meal plan for today"**
- Click "Auto Load" or "Generate New Plan"
- Check if backend service is running
- Verify API connection

**2. "Failed to generate meal plan"**
- Check Gemini AI API key
- Verify internet connection
- Check backend logs
- Ensure database is connected

**3. "Nutrition not updating"**
- Check if meals are selected (heart button clicked)
- Verify `parsedContent` exists
- Check browser console for errors

**4. "Search not working"**
- Ensure meal content is loaded
- Check `parsedContent` field
- Verify search query syntax

### **Debug Checklist**

```
□ Services running (Gateway: 3000, Meal Planner: 3005)
□ JWT token valid and not expired
□ User logged in and ID exists
□ Database connected (PostgreSQL)
□ Gemini AI key configured
□ Browser console shows no errors
□ Network tab shows successful requests
```

---

## 📈 Future Enhancements

### **Planned Features**

1. **Automatic Daily Generation**
   - Cron job at 6 AM
   - Push notifications
   - Email summaries

2. **Shopping List**
   - Generate from selected meals
   - Categorize by store section
   - Share with family

3. **Meal Tracking**
   - Log actual meals eaten
   - Compare with recommendations
   - Track over time

4. **Recipe Details**
   - Step-by-step photos
   - Video tutorials
   - Cooking time estimates

5. **Social Features**
   - Share favorite meals
   - Rate meals
   - Community recipes

6. **Advanced Personalization**
   - Learn from selections
   - Adapt to preferences
   - Seasonal adjustments

7. **Export & Print**
   - PDF meal plans
   - Weekly summaries
   - Shopping lists

---

## 📚 Related Documentation

- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - API Gateway integration
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Complete testing procedures
- [REFACTORING_NUTRITION_GUIDE.md](./REFACTORING_NUTRITION_GUIDE.md) - Nutrition implementation
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide

---

## 🎉 Conclusion

The Daily Meal Recommendation System provides a complete solution for personalized nutrition planning during pregnancy. With AI-powered recommendations, comprehensive nutrition tracking, and an intuitive interface, it helps users make informed dietary choices.

**Key Takeaways:**
- ✅ Fully functional CRUD operations
- ✅ Real-time nutrition tracking
- ✅ Beautiful, responsive UI
- ✅ AI-powered personalization
- ✅ Complete history management
- ✅ Ready for production use

**Get Started:**
1. Generate your first meal plan
2. Select your favorite meals
3. Track your nutrition progress
4. Review your history
5. Meet your daily goals!

---

*Happy meal planning! 🍽️✨*
