import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Search,
  CheckCircle,
  X
} from '../ui/Icons';
import { MealPlan, GroupedMealSuggestions } from '../../types/meal';
import { MealRecommendationCard } from './MealRecommendationCard';

interface MealPlanHistoryProps {
  mealPlans: MealPlan[];
  onDelete?: (planId: string) => void;
  onSelect?: (suggestionId: string, isSelected: boolean) => void;
}

export const MealPlanHistory: React.FC<MealPlanHistoryProps> = ({
  mealPlans,
  onDelete,
  onSelect,
}) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [manuallyCollapsed, setManuallyCollapsed] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'selected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  // Helper to flatten grouped suggestions to array
  const flattenSuggestions = (grouped: GroupedMealSuggestions) => {
    return [
      ...grouped.breakfast,
      ...grouped.lunch,
      ...grouped.dinner,
      ...grouped.snack,
    ];
  };

  const filteredPlans = mealPlans.filter((plan) => {
    // Date filter
    const planDate = new Date(plan.date);
    const now = new Date();
    
    if (dateFilter === 'today') {
      if (!(planDate.toDateString() === now.toDateString())) return false;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (planDate < weekAgo) return false;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      if (planDate < monthAgo) return false;
    }
    
    // Filter by type
    if (filterType === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (planDate < weekAgo) return false;
    } else if (filterType === 'selected') {
      const allSuggestions = flattenSuggestions(plan.suggestions);
      const hasSelected = allSuggestions.some((s) => s.isSelected);
      if (!hasSelected) return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = plan.title.toLowerCase().includes(query);
      const allSuggestions = flattenSuggestions(plan.suggestions);
      const matchesMeal = allSuggestions.some((s) => {
        return s.content.name.toLowerCase().includes(query);
      });
      return matchesTitle || matchesMeal;
    }

    return true;
  });

  const toggleExpand = (planId: string) => {
    const newExpanded = expandedPlan === planId ? null : planId;
    setExpandedPlan(newExpanded);
    // Set flag when user manually collapses during active search
    if (newExpanded === null && searchQuery) {
      setManuallyCollapsed(true);
    }
  };

  // Helper to check if a plan contains search match
  const planContainsSearchMatch = (plan: MealPlan) => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    
    // Check title
    if (plan.title.toLowerCase().includes(query)) return true;
    
    // Check meal names
    const allSuggestions = flattenSuggestions(plan.suggestions);
    return allSuggestions.some(s => 
      s.content.name.toLowerCase().includes(query)
    );
  };

  // Auto-expand plans that match search (unless manually collapsed)
  React.useEffect(() => {
    if (searchQuery && filteredPlans.length > 0 && !manuallyCollapsed) {
      const matchingPlan = filteredPlans.find(plan => planContainsSearchMatch(plan));
      if (matchingPlan && expandedPlan !== matchingPlan.id) {
        setExpandedPlan(matchingPlan.id);
      }
    }
  }, [searchQuery, filteredPlans, manuallyCollapsed]);

  // Reset manual collapse flag when search query changes
  React.useEffect(() => {
    setManuallyCollapsed(false);
  }, [searchQuery]);

  const getSelectedCount = (plan: MealPlan) => {
    const allSuggestions = flattenSuggestions(plan.suggestions);
    return allSuggestions.filter((s) => s.isSelected).length;
  };

  const getMealTypeCounts = (suggestions: GroupedMealSuggestions) => {
    return {
      breakfast: suggestions.breakfast.length,
      lunch: suggestions.lunch.length,
      dinner: suggestions.dinner.length,
      snack: suggestions.snack.length,
    };
  };

  if (mealPlans.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center shadow-lg border-2 border-purple-200/50">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
          <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          No Meal Plans Yet
        </h3>
        <p className="text-gray-600 text-base sm:text-lg">
          Generate your first daily meal plan to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Simplified Filter Controls */}
      <div className="bg-gradient-to-br from-pink-50/50 via-white to-rose-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-pink-100/50">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-sm bg-white shadow-sm"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Compact Filters in Single Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Filters:</span>
            
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-medium border-2 border-pink-200 rounded-lg bg-white hover:border-pink-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all cursor-pointer shadow-sm"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            >
              <option value="all">📅 All Time</option>
              <option value="today">🌟 Today</option>
              <option value="week">📆 This Week</option>
              <option value="month">🗓️ This Month</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-medium border-2 border-pink-200 rounded-lg bg-white hover:border-pink-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all cursor-pointer shadow-sm"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            >
              <option value="all">🍽️ All Plans</option>
              <option value="recent">⏱️ Recent</option>
              <option value="selected">✅ With Selections</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || dateFilter !== 'all' || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('all');
                  setFilterType('all');
                }}
                className="ml-auto px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-pink-700 rounded-lg transition-all shadow-sm border border-pink-200"
              >
                ✕ Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-2 text-sm text-gray-600">
        <span>
          Showing <span className="font-semibold text-pink-600">{filteredPlans.length}</span> of <span className="font-semibold">{mealPlans.length}</span> plans
        </span>
      </div>

      {/* Meal Plans List */}
      <div className="space-y-4 sm:space-y-5">
        {filteredPlans.length === 0 ? (
          <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/30 rounded-2xl p-10 sm:p-12 text-center shadow-md border border-pink-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
            </div>
            <p className="text-gray-700 font-semibold text-base sm:text-lg mb-2">No meal plans match your filters</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const counts = getMealTypeCounts(plan.suggestions);
            const selectedCount = getSelectedCount(plan);
            const isExpanded = expandedPlan === plan.id;
            
            // Check if this plan matches search query for highlighting
            const matchesSearch = planContainsSearchMatch(plan);

            return (
              <div 
                key={plan.id} 
                className={`rounded-2xl sm:rounded-3xl shadow-lg transition-all duration-300 overflow-hidden ${
                  matchesSearch
                    ? 'border-4 border-green-600 ring-4 ring-green-200 bg-gradient-to-br from-green-50/30 via-white to-green-50/20'
                    : isToday(plan.date) 
                      ? 'border-2 border-pink-300 ring-2 sm:ring-4 ring-pink-200 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/30' 
                      : 'border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl bg-gradient-to-br from-white to-purple-50/30'
                }`}
              >
                <div className="p-4 sm:p-6">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between mb-4 sm:mb-5 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <h3 
                            className={`text-base sm:text-xl font-bold break-words ${
                              matchesSearch 
                                ? 'bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent' 
                                : 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent'
                            }`}
                            style={{ fontFamily: 'Playfair Display, serif' }}
                          >
                            {plan.title}
                          </h3>
                        </div>
                        {isToday(plan.date) && (
                          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-md">
                            TODAY
                          </span>
                        )}
                        {selectedCount > 0 && (
                          <span className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{selectedCount} selected</span>
                            <span className="sm:hidden">{selectedCount}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium pl-0 sm:pl-14">
                        {formatDate(plan.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(plan.id)}
                          className="p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-sm touch-manipulation"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleExpand(plan.id)}
                        className="p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-pink-200 bg-white text-pink-600 hover:bg-pink-50 transition-all duration-300 hover:scale-105 shadow-sm touch-manipulation"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-pink-100/80 to-rose-100/60 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border border-pink-200/50">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">☀️</div>
                      <div className="text-xl sm:text-2xl font-bold text-pink-700">{counts.breakfast}</div>
                      <div className="text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Breakfast</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-100/80 to-amber-100/60 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border border-orange-200/50">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌞</div>
                      <div className="text-xl sm:text-2xl font-bold text-orange-700">{counts.lunch}</div>
                      <div className="text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Lunch</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-100/80 to-violet-100/60 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border border-purple-200/50">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">☕</div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-700">{counts.snack}</div>
                      <div className="text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Snacks</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-100/80 to-indigo-100/60 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border border-blue-200/50">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌙</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-700">{counts.dinner}</div>
                      <div className="text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Dinner</div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 border-t-2 border-pink-200 pt-4 sm:pt-6 animate-fadeIn">
                      {/* Group by meal type */}
                      {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((type) => {
                        const typeSuggestions = plan.suggestions[type];
                        if (typeSuggestions.length === 0) return null;

                        const typeColors = {
                          breakfast: { gradient: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50', icon: '☀️' },
                          lunch: { gradient: 'from-orange-500 to-amber-500', bg: 'from-orange-50 to-amber-50', icon: '🌞' },
                          snack: { gradient: 'from-purple-500 to-violet-500', bg: 'from-purple-50 to-violet-50', icon: '☕' },
                          dinner: { gradient: 'from-blue-500 to-indigo-500', bg: 'from-blue-50 to-indigo-50', icon: '🌙' }
                        };

                        return (
                          <div key={type} className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${typeColors[type].bg} border-2 border-${type === 'breakfast' ? 'pink' : type === 'lunch' ? 'orange' : type === 'snack' ? 'purple' : 'blue'}-100`}>
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${typeColors[type].gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                                <span className="text-xl sm:text-2xl">{typeColors[type].icon}</span>
                              </div>
                              <h4 
                                className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${typeColors[type].gradient} bg-clip-text text-transparent`}
                                style={{ fontFamily: 'Playfair Display, serif' }}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </h4>
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                ({typeSuggestions.length})
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                              {typeSuggestions.map((suggestion) => {
                                // Check if this specific meal matches search
                                const mealMatchesSearch = searchQuery && 
                                  suggestion.content.name.toLowerCase().includes(searchQuery.toLowerCase());
                                
                                return (
                                  <div 
                                    key={suggestion.id}
                                    className={`${
                                      mealMatchesSearch 
                                        ? 'ring-4 ring-green-400 rounded-2xl sm:rounded-3xl border-4 border-green-600' 
                                        : ''
                                    }`}
                                  >
                                    <MealRecommendationCard
                                        suggestion={suggestion}
                                        onSelect={onSelect}
                                        showActions={true}
                                      />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MealPlanHistory;
