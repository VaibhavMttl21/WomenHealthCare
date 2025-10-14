import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Utensils, 
  Plus, 
  RefreshCw, 
  Calendar,
  AlertCircle,
  CheckCircle
} from '../../components/ui/Icons';
import { MealTypeSection } from '../../components/meal/MealRecommendationCard';
import { MealPlanHistory } from '../../components/meal/MealPlanHistory';
import { MealPlan, NutritionInfo, DailyNutritionGoal, GroupedMealSuggestions } from '../../types/meal';
import * as mealService from '../../services/mealService';

const MealPlannerPage: React.FC = () => {
  const [view, setView] = useState<'today' | 'history'>('today');
  const [todayPlan, setTodayPlan] = useState<MealPlan | null>(null);
  const [allPlans, setAllPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Nutrition goals based on pregnancy stage (you can customize these)
  const nutritionGoals: DailyNutritionGoal = {
    calories: 2200,
    protein: 75,
    iron: 27,
    calcium: 1200,
    folate: 600,
    vitaminA: 770,
    vitaminC: 85,
  };

  // Load data on mount and when view changes
  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === 'today') {
        // Auto-generate today's plan if it doesn't exist
        const userProfile = 'Pregnant woman in second trimester';
        const plan = await mealService.autoGenerateTodayPlan(userProfile);
        setTodayPlan(plan);
        
        // Show success message only if plan was newly generated
        if (plan) {
          const planDate = new Date(plan.date);
          const today = new Date();
          const isToday = planDate.toDateString() === today.toDateString();
          
          if (isToday) {
            setSuccess('Daily meal plan loaded! 🎉');
            setTimeout(() => setSuccess(null), 3000);
          }
        }
      } else {
        const plans = await mealService.getUserMealPlans(30);
        setAllPlans(plans);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);
    try {
      const userProfile = 'Pregnant woman in second trimester'; // You can get this from user profile
      const newPlan = await mealService.generateMealPlan(userProfile);
      setTodayPlan(newPlan);
      setSuccess('New meal plan generated successfully! 🎉');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSuggestion = async (suggestionId: string, isSelected: boolean) => {
    try {
      await mealService.updateSuggestionSelection(suggestionId, isSelected);
      
      // Update local state - helper to update grouped suggestions
      const updateGroupedSuggestions = (suggestions: GroupedMealSuggestions) => {
        const updated = { ...suggestions };
        for (const mealType of ['breakfast', 'lunch', 'dinner', 'snack'] as const) {
          updated[mealType] = suggestions[mealType].map((s) =>
            s.id === suggestionId ? { ...s, isSelected } : s
          );
        }
        return updated;
      };

      if (view === 'today' && todayPlan) {
        setTodayPlan({ 
          ...todayPlan, 
          suggestions: updateGroupedSuggestions(todayPlan.suggestions)
        });
      } else {
        const updatedPlans = allPlans.map((plan) => ({
          ...plan,
          suggestions: updateGroupedSuggestions(plan.suggestions),
        }));
        setAllPlans(updatedPlans);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update selection');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      await mealService.deleteMealPlan(planId);
      
      // Remove from local state
      if (todayPlan?.id === planId) {
        setTodayPlan(null);
      }
      setAllPlans(allPlans.filter((p) => p.id !== planId));
      
      setSuccess('Meal plan deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete meal plan');
    }
  };

  // Calculate current nutrition from selected meals
  const calculateCurrentNutrition = (): NutritionInfo | null => {
    if (!todayPlan) return null;

    // Flatten grouped suggestions and filter selected ones
    const allSuggestions = [
      ...todayPlan.suggestions.breakfast,
      ...todayPlan.suggestions.lunch,
      ...todayPlan.suggestions.dinner,
      ...todayPlan.suggestions.snack,
    ];
    
    const selected = allSuggestions.filter((s) => s.isSelected);
    if (selected.length === 0) return null;

    return selected.reduce(
      (acc, s) => {
        const nutrition = s.content.nutrition;
        return {
          calories: acc.calories + (nutrition.calories || 0),
          protein: acc.protein + (nutrition.protein || 0),
          carbohydrates: acc.carbohydrates + (nutrition.carbohydrates || 0),
          fats: acc.fats + (nutrition.fats || 0),
          fiber: acc.fiber + (nutrition.fiber || 0),
          iron: acc.iron + (nutrition.iron || 0),
          calcium: acc.calcium + (nutrition.calcium || 0),
          folate: acc.folate + (nutrition.folate || 0),
          vitaminA: acc.vitaminA + (nutrition.vitaminA || 0),
          vitaminC: acc.vitaminC + (nutrition.vitaminC || 0),
          servingSize: '',
        };
      },
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0,
        iron: 0,
        calcium: 0,
        folate: 0,
        vitaminA: 0,
        vitaminC: 0,
        servingSize: '',
      }
    );
  };

  const currentNutrition = calculateCurrentNutrition();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                AI Meal Planner
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 italic" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                Smart, personalized meal suggestions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-sm flex-1 sm:flex-initial">
              <button
                onClick={() => setView('today')}
                className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  view === 'today'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setView('history')}
                className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 ${
                  view === 'history'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>History</span>
              </button>
            </div>

            {/* Action Buttons */}
            {view === 'today' && (
              <button
                onClick={handleGeneratePlan}
                disabled={generating}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-red-800 flex-1 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 transition-colors">
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-green-800 flex-1 text-sm">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800 transition-colors">
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center shadow-sm">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your meal plans...</p>
          </div>
        ) : view === 'today' ? (
          /* Today's View */
          <>
            {todayPlan ? (
              <>
                {/* Nutrition Progress */}
                <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-3xl p-5 shadow-lg border-2 border-[#6b8e23]/20">
                  <div className="mb-5">
                    <h2 
                      className="text-2xl font-bold text-[#4a5d23] mb-1"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {currentNutrition ? "Today's Nutrition" : "Your Daily Goals"}
                    </h2>
                    <p className="text-xs text-gray-600">
                      {currentNutrition ? "Selected meals nutritional summary" : "Select meals to track your progress"}
                    </p>
                  </div>
                  
                  {currentNutrition ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                      {/* Calories */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-red-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {Math.round(currentNutrition.calories) || 0}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.calories || 0) / nutritionGoals.calories) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.calories}</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Cal</div>
                        </div>
                      </div>

                      {/* Protein */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {Math.round(currentNutrition.protein) || 0}g
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.protein || 0) / nutritionGoals.protein) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.protein}g</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Protein</div>
                        </div>
                      </div>

                      {/* Iron */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {Math.round(currentNutrition.iron) || 0}mg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.iron || 0) / nutritionGoals.iron) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.iron}mg</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Iron</div>
                        </div>
                      </div>

                      {/* Calcium */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {Math.round(currentNutrition.calcium) || 0}mg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.calcium || 0) / nutritionGoals.calcium) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.calcium}mg</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Calcium</div>
                        </div>
                      </div>

                      {/* Folate */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-pink-600 mb-1">
                            {Math.round(currentNutrition.folate) || 0}mcg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-pink-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.folate || 0) / nutritionGoals.folate) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.folate}mcg</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Folate</div>
                        </div>
                      </div>

                      {/* Vitamin A */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-yellow-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-yellow-600 mb-1">
                            {Math.round(currentNutrition.vitaminA) || 0}mcg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.vitaminA || 0) / nutritionGoals.vitaminA) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.vitaminA}mcg</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Vit A</div>
                        </div>
                      </div>

                      {/* Vitamin C */}
                      <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-green-100">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {Math.round(currentNutrition.vitaminC) || 0}mg
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${Math.min(((currentNutrition.vitaminC || 0) / nutritionGoals.vitaminC) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">of {nutritionGoals.vitaminC}mg</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">Vit C</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-700 font-semibold mb-4">Start Selecting Your Meals</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.calories}</div>
                          <div className="text-xs text-gray-500 mt-1">Cal</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.protein}g</div>
                          <div className="text-xs text-gray-500 mt-1">Protein</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.iron}mg</div>
                          <div className="text-xs text-gray-500 mt-1">Iron</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.calcium}mg</div>
                          <div className="text-xs text-gray-500 mt-1">Calcium</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.folate}mcg</div>
                          <div className="text-xs text-gray-500 mt-1">Folate</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.vitaminA}mcg</div>
                          <div className="text-xs text-gray-500 mt-1">Vit A</div>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200 shadow-sm">
                          <div className="text-xl font-bold text-gray-400">{nutritionGoals.vitaminC}mg</div>
                          <div className="text-xs text-gray-500 mt-1">Vit C</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meal Suggestions by Type */}
                <div className="space-y-8">
                  <MealTypeSection
                    mealType="BREAKFAST"
                    suggestions={todayPlan.suggestions.breakfast}
                    onSelect={handleSelectSuggestion}
                    showActions={true}
                  />
                  <MealTypeSection
                    mealType="LUNCH"
                    suggestions={todayPlan.suggestions.lunch}
                    onSelect={handleSelectSuggestion}
                    showActions={true}
                  />
                  <MealTypeSection
                    mealType="SNACK"
                    suggestions={todayPlan.suggestions.snack}
                    onSelect={handleSelectSuggestion}
                    showActions={true}
                  />
                  <MealTypeSection
                    mealType="DINNER"
                    suggestions={todayPlan.suggestions.dinner}
                    onSelect={handleSelectSuggestion}
                    showActions={true}
                  />
                </div>

                {/* Tip of the Day */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-6 shadow-sm border border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Nutritionist's Tip
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Select your preferred meals to see your personalized nutrition progress.
                        Aim to meet your daily goals for optimal wellness during pregnancy!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Utensils className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No Meal Plan Yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Generate a personalized daily meal plan with AI-powered nutrition recommendations tailored for your wellness journey!
                </p>
                <button
                  onClick={handleGeneratePlan}
                  disabled={generating}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Meal Plan'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* History View */
          <MealPlanHistory
            mealPlans={allPlans}
            onDelete={handleDeletePlan}
            onSelect={handleSelectSuggestion}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MealPlannerPage;
