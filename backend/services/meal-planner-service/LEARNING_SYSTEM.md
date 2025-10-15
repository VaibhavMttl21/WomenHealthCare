# 🧠 Learning & Personalization Implementation Guide

## Overview

The Meal Planner Service now includes an **intelligent learning system** that analyzes user behavior and personalizes recommendations over time. This document explains how it works and how to use it.

---

## 🔄 How It Works: The Complete Flow

### **1. User Generates First Meal Plan (No History)**

```typescript
// First time user
POST /api/mealplan/generate
Body: { userId: "user_123", userProfile: "Second trimester" }

// System behavior:
// - No history found
// - learningConfidence = 0
// - Uses generic recommendations
// - Saves plan to database
```

**Response:** 8 meal suggestions (2 per type), no personalization yet.

---

### **2. User Selects Preferences**

```typescript
// User tries breakfast Option 2 (budget-friendly) and likes it
PUT /api/mealplan/suggestion/sugg_ragi_porridge
Body: { isSelected: true }

// System records:
// - User ID: user_123
// - Suggestion: Ragi porridge (orderIndex: 1 = budget option)
// - Timestamp: 2025-10-11
```

**Database:** `isSelected = true` flag saved for this suggestion.

---

### **3. Next Generation: Learning Applied**

```typescript
// User requests new meal plan (next day or week)
POST /api/mealplan/generate
Body: { userId: "user_123", userProfile: "Second trimester" }

// System behavior:
// Step 1: Analyze past 30 days of history
const learningContext = await analyzeUserPreferences(userId);

// Step 2: Build personalized context
const enhancedContext = buildPersonalizedContext(userProfile, learningContext);

// Step 3: Generate with AI using learned preferences
const mealSuggestions = await generateMealSuggestionsWithGemini(enhancedContext);
```

**Result:** Personalized recommendations based on user's demonstrated preferences!

---

## 📊 Learning Components

### **1. Budget Preference Analysis**

```typescript
// Analyzes orderIndex of selected suggestions
// orderIndex: 0 = Normal option, 1 = Budget option

budgetSelections = 7  // User selected 7 budget options
normalSelections = 1  // User selected 1 normal option
totalSelections = 8

budgetPreference = 7/8 = 0.875 (87.5% budget preference)

// Translation:
if (budgetPreference > 0.7) → 'high' = User prefers budget-friendly
if (budgetPreference < 0.3) → 'low' = User prefers normal options
else → 'medium' = Mixed preference
```

**AI Impact:**
```
High budget preference (>70%):
→ Prioritize cost-effective ingredients
→ Average budget: ₹10-12
→ Focus on seasonal/local items
→ Simple preparations

Low budget preference (<30%):
→ Can suggest premium ingredients
→ Average budget: ₹20-25
→ More variety and exotic options
```

---

### **2. Ingredient Frequency Analysis**

```typescript
// Extracts ingredients from selected meal names
// Meal name example: "Rice flakes (Poha) with peas (Matar)"
// Extracts: ["Poha", "Matar"]

selectedMeals = [
  "Rice flakes (Poha) with peas (Matar)",
  "Ragi porridge (Nachni) with jaggery (Gur)",
  "Lentils (Dal) with rice (Chawal)",
  "Ragi dosa (Nachni) with chutney"
]

ingredientFrequency = {
  "Poha": 1,
  "Matar": 1,
  "Nachni": 2,  // ← Most frequent!
  "Gur": 1,
  "Dal": 1,
  "Chawal": 1
}

topIngredients = ["Nachni", "Poha", "Matar", "Gur", "Dal"]
```

**AI Impact:**
```
AI Prompt Enhancement:
"User frequently selects meals with: Nachni, Poha, Matar, Gur, Dal
Try to incorporate these ingredients where appropriate"

Result: More Ragi (Nachni) based meals in future suggestions
```

---

### **3. Favorite Meals Tracking**

```typescript
// Tracks which specific meals were selected

mealFrequency = {
  "Ragi porridge (Nachni) with jaggery (Gur)": 3,  // Selected 3 times!
  "Lentils (Dal) with rice (Chawal)": 2,
  "Rice flakes (Poha) with peas (Matar)": 1
}

favoriteMeals = [
  "Ragi porridge (Nachni) with jaggery (Gur)",
  "Lentils (Dal) with rice (Chawal)"
]
```

**AI Impact:**
```
AI Prompt Enhancement:
"User's favorite meals include: 
- Ragi porridge (Nachni) with jaggery (Gur)
- Lentils (Dal) with rice (Chawal)

Consider variations of these successful recipes"

Result: AI generates similar meals like:
- Ragi dosa (variation of Ragi porridge)
- Moong dal rice (variation of Dal Chawal)
```

---

### **4. Meal Type Engagement**

```typescript
// Measures how often user selects suggestions for each meal type

breakfast: { selected: 6, total: 8 } → engagement: 75%
lunch: { selected: 8, total: 8 } → engagement: 100%
dinner: { selected: 4, total: 8 } → engagement: 50%
snack: { selected: 2, total: 8 } → engagement: 25%
```

**Insights & Future Actions:**
```
High breakfast engagement (75%):
✓ User actively uses breakfast suggestions
→ Continue providing variety

Perfect lunch engagement (100%):
✓ All lunch suggestions are being used
→ Current lunch recommendations are excellent

Low dinner engagement (50%):
⚠ User only uses half the dinner suggestions
→ May need simpler dinner options
→ Consider quick-prep meals

Very low snack engagement (25%):
⚠ User rarely selects snacks
→ Investigate: Are snacks too complex? Too expensive?
→ Consider simpler, grab-and-go options
```

---

### **5. Learning Confidence**

```typescript
// Confidence increases with more data
// Maximum confidence at 20+ selections

totalSelections = 5  → confidence = 5/20 = 0.25 (25%)
totalSelections = 10 → confidence = 10/20 = 0.50 (50%)
totalSelections = 20 → confidence = 20/20 = 1.00 (100%)

if (confidence < 0.3) {
  // Not enough data - use minimal personalization
  return genericRecommendations();
}

if (confidence >= 0.7) {
  // High confidence - strong personalization
  return highlyPersonalizedRecommendations();
}
```

**Why This Matters:**
- Prevents over-personalization with limited data
- Ensures recommendations are reliable
- Gradually increases personalization as data grows

---

## 🎯 Personalization in Action: Real Example

### **Week 1: No History**

```json
// User generates first plan
{
  "learningContext": {
    "budgetPreference": 0.5,
    "topIngredients": [],
    "favoriteMeals": [],
    "totalSelections": 0,
    "learningConfidence": 0
  },
  "personalizationPrompt": "" 
}
```

**AI Prompt:** Generic recommendations (no personalization)

---

### **Week 2: Learning Begins**

```json
// User has made 4 selections (all budget options)
{
  "learningContext": {
    "budgetPreference": 1.0,
    "topIngredients": ["Nachni", "Gur", "Dal", "Chawal"],
    "favoriteMeals": ["Ragi porridge", "Dal rice"],
    "averageCost": 11,
    "totalSelections": 4,
    "learningConfidence": 0.2
  },
  "personalizationPrompt": "
    **PERSONALIZATION BASED ON USER HISTORY:**
    - User strongly prefers BUDGET-FRIENDLY options (average budget: ₹11)
    - Prioritize cost-effective ingredients and simple preparations
    - User frequently selects meals with: Nachni, Gur, Dal, Chawal
    
    (Personalization confidence: 20% based on user history)
  "
}
```

**AI Prompt:** Includes personalization, but with low confidence note

---

### **Week 4: Mature Learning**

```json
// User has made 15 selections
{
  "learningContext": {
    "budgetPreference": 0.93,
    "topIngredients": ["Nachni", "Dal", "Chawal", "Gur", "Poha"],
    "favoriteMeals": [
      "Ragi porridge (Nachni) with jaggery (Gur)",
      "Lentils (Dal) with rice (Chawal)",
      "Rice flakes (Poha) with vegetables"
    ],
    "averageCost": 10.5,
    "totalSelections": 15,
    "learningConfidence": 0.75
  },
  "personalizationPrompt": "
    **PERSONALIZATION BASED ON USER HISTORY:**
    - User strongly prefers BUDGET-FRIENDLY options (average budget: ₹11)
    - Prioritize cost-effective ingredients and simple preparations
    - Focus on locally available, seasonal, and affordable ingredients
    - User frequently selects meals with: Nachni, Dal, Chawal, Gur, Poha
    - Try to incorporate these ingredients where appropriate
    - User's favorite meals include: Ragi porridge, Dal rice, Poha with vegetables
    - Consider variations of these successful recipes
    
    (Personalization confidence: 75% based on user history)
  "
}
```

**AI Prompt:** Highly personalized with strong confidence

**Result:** AI generates meals perfectly aligned with user preferences!

---

## 🔮 Future Enhancements (Placeholders Included)

### **1. UserProfile Integration**

```typescript
// CURRENTLY: Using raw string
userProfile: "Second trimester, vegetarian"

// FUTURE: Structured data from database
const userProfileData = await prisma.userProfile.findUnique({
  where: { userId }
});

context = {
  pregnancyStage: userProfileData.pregnancyStage,        // "SECOND_TRIMESTER"
  dietaryRestrictions: JSON.parse(userProfileData.dietaryPreferences), // ["vegetarian"]
  allergies: JSON.parse(userProfileData.foodAllergies),  // ["peanuts"]
  region: `${userProfileData.district}, ${userProfileData.state}` // "Bhopal, MP"
}
```

**Code Location:** `buildPersonalizedContext()` function has TODO comments

---

### **2. Dietary Restrictions**

```typescript
// PLACEHOLDER in buildPersonalizationPrompt():
if (context.dietaryRestrictions && context.dietaryRestrictions.length > 0) {
  prompts.push(
    `- DIETARY RESTRICTIONS: ${context.dietaryRestrictions.join(', ')}`,
    `- Ensure all suggestions comply with these restrictions`
  );
}

// FUTURE: Will be populated from UserProfile.dietaryPreferences
```

---

### **3. Allergy Awareness**

```typescript
// PLACEHOLDER in buildPersonalizationPrompt():
if (context.allergies && context.allergies.length > 0) {
  prompts.push(
    `- ALLERGIES: Avoid ${context.allergies.join(', ')}`,
    `- Do not include these ingredients in any form`
  );
}

// FUTURE: Will be populated from UserProfile.foodAllergies
```

---

### **4. Pregnancy Stage Adaptation**

```typescript
// PLACEHOLDER in buildPersonalizationPrompt():
if (context.pregnancyStage) {
  prompts.push(
    `- Pregnancy Stage: ${context.pregnancyStage}`,
    `- Tailor nutrition recommendations for this stage`
  );
}

// FUTURE: Will be populated from UserProfile.pregnancyStage
// Can provide stage-specific recommendations:
// - First trimester: Light, easy-to-digest meals
// - Second trimester: Increased protein and calcium
// - Third trimester: Small, frequent meals
```

---

### **5. Regional Preferences**

```typescript
// PLACEHOLDER in buildPersonalizationPrompt():
if (context.region) {
  prompts.push(
    `- Region: ${context.region}`,
    `- Prioritize ingredients commonly available in this region`
  );
}

// FUTURE: Will be populated from UserProfile.village/district/state
// Can prioritize region-specific ingredients and recipes
```

---

## 🛠️ Implementation Details

### **Function: analyzeUserPreferences()**

**Purpose:** Learn from user's past 30 days of selections

**Algorithm:**
1. Fetch meal plans from last 30 days
2. Extract all selected suggestions
3. Calculate budget preference ratio
4. Count ingredient frequencies
5. Track favorite meals
6. Measure meal type engagement
7. Calculate learning confidence
8. Return structured learning context

**Performance:** O(n) where n = number of suggestions in history

---

### **Function: buildPersonalizedContext()**

**Purpose:** Combine profile data + learned preferences

**Algorithm:**
1. Accept raw user profile string (future: structured data)
2. Accept learned preferences from analyzeUserPreferences()
3. Translate budget preference number to category
4. Extract top 5 preferred ingredients
5. Include placeholders for future profile fields
6. Return structured personalized context

**Extensibility:** Marked with TODO comments for future enhancements

---

### **Function: buildPersonalizationPrompt()**

**Purpose:** Convert personalized context to natural language for AI

**Algorithm:**
1. Check if confidence is sufficient (>30%)
2. Build budget preference instructions
3. Add ingredient preferences
4. Include favorite meals
5. Add dietary restrictions (if available)
6. Add allergy warnings (if available)
7. Include pregnancy stage guidance (if available)
8. Add regional preferences (if available)
9. Append confidence level note
10. Return formatted prompt string

**Output:** Natural language instructions appended to AI prompt

---

## 📈 Monitoring & Analytics

### **Logging Points**

```typescript
// 1. Learning analysis
console.log(`Learning: User selected ${budgetSelections.length} budget options vs ${normalSelections.length} normal options`);

// 2. Confidence level
console.log(`Personalization confidence: ${confidencePercent}%`);

// 3. Top ingredients
console.log(`Top ingredients: ${topIngredients.join(', ')}`);
```

### **Metrics to Track**

```typescript
// User engagement metrics
{
  "userId": "user_123",
  "totalPlansGenerated": 10,
  "totalSelections": 15,
  "selectionRate": 0.375,  // 15/40 (10 plans × 4 meal types × 1 selected per type)
  "budgetPreference": 0.93,
  "learningConfidence": 0.75,
  "topIngredients": ["Nachni", "Dal", "Chawal"],
  "averageCost": 10.5
}
```

---

## 🧪 Testing the Learning System

### **Test Case 1: New User (No History)**

```bash
# Generate first plan
curl -X POST http://localhost:3004/api/mealplan/generate \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user_new", "userProfile": "First trimester"}'

# Expected: Generic recommendations, no personalization
# learningConfidence: 0
# personalizationPrompt: ""
```

---

### **Test Case 2: Budget-Conscious User**

```bash
# Generate plan
POST /api/mealplan/generate { userId: "test_user_budget" }

# Select all budget options (orderIndex: 1)
PUT /api/mealplan/suggestion/breakfast_2 { isSelected: true }
PUT /api/mealplan/suggestion/lunch_2 { isSelected: true }
PUT /api/mealplan/suggestion/dinner_2 { isSelected: true }
PUT /api/mealplan/suggestion/snack_2 { isSelected: true }

# Generate new plan
POST /api/mealplan/generate { userId: "test_user_budget" }

# Expected: Budget-focused recommendations
# budgetPreference: 1.0 (100%)
# AI prompt includes: "User strongly prefers BUDGET-FRIENDLY options"
```

---

### **Test Case 3: Favorite Ingredient Tracking**

```bash
# User selects multiple Ragi-based meals
# Week 1: Ragi porridge ✓
# Week 2: Ragi dosa ✓
# Week 3: Ragi idli ✓

# Generate new plan
POST /api/mealplan/generate { userId: "test_user_ragi" }

# Expected: More Ragi variations
# topIngredients: ["Nachni", ...]
# AI prompt includes: "User frequently selects meals with: Nachni"
```

---

## 🎓 Key Takeaways

1. **Learning is Automatic** - No manual configuration needed
2. **Confidence-Based** - Personalization increases with data
3. **Non-Intrusive** - Works with generic recommendations if no history
4. **Extensible** - Placeholders ready for UserProfile integration
5. **Transparent** - Confidence level shown in AI prompts
6. **Privacy-Respecting** - Only uses user's own selection history

---

## 📝 Next Steps

### **For Developers:**

1. ✅ Learning system implemented
2. ✅ Personalization engine ready
3. ✅ Placeholders for UserProfile data
4. ⏳ Integrate with UserProfile table (future)
5. ⏳ Add advanced analytics dashboard (future)
6. ⏳ Implement A/B testing for prompts (future)

### **For Frontend:**

1. Show personalization confidence to user
2. Display "Based on your preferences" badge
3. Add feedback: "Was this recommendation helpful?"
4. Show learning progress: "AI is learning your preferences (75% confident)"

---

## 🚀 Conclusion

The meal planner now **learns from every interaction** and **personalizes recommendations** automatically. As users select their preferences, the AI becomes smarter and more aligned with their unique needs!

**The more you use it, the better it gets! 🧠✨**
