import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Info,
  Utensils
} from '../ui/Icons';
import { MealSuggestion } from '../../types/meal';
import { updateSuggestionSelection } from '../../services/mealService';

interface MealRecommendationCardProps {
  suggestion: MealSuggestion;
  onSelect?: (suggestionId: string, isSelected: boolean) => void;
  showActions?: boolean;
}

export const MealRecommendationCard: React.FC<MealRecommendationCardProps> = ({
  suggestion,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heartHover, setHeartHover] = useState(false);
  const meal = suggestion.content; // Content is now directly available, no parsing needed

  if (!meal) return null;

  const handleSelect = async () => {
    if (!onSelect) return;
    
    setLoading(true);
    try {
      await updateSuggestionSelection(suggestion.id, !suggestion.isSelected);
      onSelect(suggestion.id, !suggestion.isSelected);
    } catch (error) {
      console.error('Error updating selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getMealIcon = () => {
    switch (suggestion.type) {
      case 'BREAKFAST': return '☀️';
      case 'LUNCH': return '🌞';
      case 'DINNER': return '🌙';
      case 'SNACK': return '☕';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = () => {
    switch (suggestion.type) {
      case 'BREAKFAST': return 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700';
      case 'LUNCH': return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700';
      case 'SNACK': return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700';
      case 'DINNER': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700';
    }
  };

  const getMealBorderColor = () => {
    switch (suggestion.type) {
      case 'BREAKFAST': return 'border-pink-300';
      case 'LUNCH': return 'border-orange-300';
      case 'SNACK': return 'border-purple-300';
      case 'DINNER': return 'border-blue-300';
      default: return 'border-gray-300';
    }
  };

  const getMealCardBackground = () => {
    switch (suggestion.type) {
      case 'BREAKFAST': return 'bg-gradient-to-br from-pink-50/80 via-white to-rose-50/60';
      case 'LUNCH': return 'bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50';
      case 'SNACK': return 'bg-gradient-to-br from-purple-50/80 via-white to-violet-50/60';
      case 'DINNER': return 'bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50';
      default: return 'bg-gradient-to-br from-white to-gray-50/30';
    }
  };

  return (
    <div 
      className={`rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border-2 relative group ${
        suggestion.isSelected 
          ? `${getMealBorderColor()} ring-2 sm:ring-4 ${getMealBorderColor().replace('border-', 'ring-')}/30` 
          : `${getMealBorderColor()} border-opacity-40`
      } ${getMealCardBackground()}`}
      style={{
        transform: 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="p-4 sm:p-6">
        {/* Heart Icon - Top Right Corner */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <button
            onClick={handleSelect}
            disabled={loading}
            onMouseEnter={() => setHeartHover(true)}
            onMouseLeave={() => setHeartHover(false)}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 touch-manipulation ${
              suggestion.isSelected 
                ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-lg scale-110' 
                : 'bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:scale-110'
            }`}
          >
            <Heart 
              className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${
                suggestion.isSelected 
                  ? 'text-white fill-current' 
                  : heartHover 
                    ? 'text-red-500 fill-current scale-110' 
                    : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start mb-3 sm:mb-4 pr-14 sm:pr-16">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg bg-white/90 backdrop-blur-sm flex-shrink-0"
              style={{
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              {getMealIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold mb-1.5 sm:mb-2 ${getMealTypeColor()} shadow-sm`}>
                {suggestion.type.charAt(0) + suggestion.type.slice(1).toLowerCase()}
              </span>
              <h3 
                className="text-lg sm:text-xl font-bold leading-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent break-words"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {meal.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 sm:mb-5 leading-relaxed font-light">
          {meal.why}
        </p>

        {/* Nutrition Quick View */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="text-center p-2.5 sm:p-3 bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100/50">
            <div className="text-base sm:text-lg font-bold text-pink-600">{meal.nutrition.calories}</div>
            <div className="text-xs text-gray-500 font-medium">Cal</div>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50">
            <div className="text-base sm:text-lg font-bold text-blue-600">{meal.nutrition.protein}g</div>
            <div className="text-xs text-gray-500 font-medium">Protein</div>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100/50">
            <div className="text-base sm:text-lg font-bold text-purple-600">{meal.nutrition.iron}mg</div>
            <div className="text-xs text-gray-500 font-medium">Iron</div>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100/50">
            <div className="text-base sm:text-lg font-bold text-indigo-600">{meal.nutrition.calcium}mg</div>
            <div className="text-xs text-gray-500 font-medium">Calcium</div>
          </div>
        </div>

        {/* Benefits Preview */}
        {!expanded && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-lavender-50/50 to-purple-50/30 border border-purple-100/50">
            <p className="text-sm text-gray-700 italic line-clamp-2 leading-relaxed">
              💜 {meal.benefits}
            </p>
          </div>
        )}

        {/* Expandable Details */}
        {expanded && (
          <div className="space-y-4 sm:space-y-5 border-t-2 border-purple-100 pt-4 sm:pt-5 mt-4 sm:mt-5 animate-fadeIn">
            {/* Full Benefits */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-50/60 to-rose-50/40 border border-pink-100/50">
              <h4 className="text-sm font-bold text-pink-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 fill-current" />
                Key Benefits
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {meal.benefits}
              </p>
            </div>

            {/* Nutrition Facts */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100/50">
              <h4 className="text-sm font-bold text-blue-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Complete Nutrition Facts
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Carbs:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.carbohydrates}g</span>
                </div>
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Fats:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.fats}g</span>
                </div>
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Fiber:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.fiber}g</span>
                </div>
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Folate:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.folate}mcg</span>
                </div>
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Vitamin A:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.vitaminA}mcg</span>
                </div>
                <div className="flex justify-between p-2.5 sm:p-3 bg-white/80 rounded-lg sm:rounded-xl shadow-sm">
                  <span className="text-gray-600 font-medium text-xs sm:text-sm">Vitamin C:</span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{meal.nutrition.vitaminC}mg</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 sm:mt-3 italic">Serving: {meal.nutrition.servingSize}</p>
            </div>

            {/* Fun Facts */}
            {meal.facts && meal.facts.trim() && (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50/60 to-violet-50/40 border border-purple-100/50">
                <h4 className="text-sm font-bold text-purple-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="text-base sm:text-lg">💡</span>
                  Did You Know?
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed pl-3 sm:pl-4 border-l-4 border-purple-400">
                  {meal.facts}
                </p>
              </div>
            )}

            {/* Preparation Steps */}
            {meal.steps && meal.steps.trim() && (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50/60 to-amber-50/40 border border-orange-100/50">
                <h4 className="text-sm font-bold text-orange-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  Preparation Guide
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {meal.steps}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expand Toggle */}
        <div className="flex items-center justify-center mt-4 sm:mt-5">
          <button
            onClick={toggleExpanded}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-2 border-purple-200 rounded-xl sm:rounded-2xl text-sm font-semibold text-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md touch-manipulation active:scale-95"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </>
            ) : (
              <>
                <span>View Full Details</span>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to display all meal suggestions for a meal type
interface MealTypeSectionProps {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  suggestions: MealSuggestion[];
  onSelect?: (suggestionId: string, isSelected: boolean) => void;
  showActions?: boolean;
}

export const MealTypeSection: React.FC<MealTypeSectionProps> = ({
  mealType,
  suggestions,
  onSelect,
  showActions = true,
}) => {
  // Suggestions are already filtered by type from grouped data
  if (suggestions.length === 0) return null;

  const getSectionIcon = () => {
    switch (mealType) {
      case 'BREAKFAST': return '☀️';
      case 'LUNCH': return '🌞';
      case 'DINNER': return '🌙';
      case 'SNACK': return '☕';
      default: return '🍽️';
    }
  };

  const getSectionGradient = () => {
    switch (mealType) {
      case 'BREAKFAST': return 'from-pink-500 via-rose-500 to-pink-400';
      case 'LUNCH': return 'from-orange-500 via-amber-500 to-orange-400';
      case 'SNACK': return 'from-purple-500 via-violet-500 to-purple-400';
      case 'DINNER': return 'from-blue-500 via-indigo-500 to-blue-400';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getSectionBgGradient = () => {
    switch (mealType) {
      case 'BREAKFAST': return 'from-pink-50/50 to-rose-50/30';
      case 'LUNCH': return 'from-orange-50/50 to-amber-50/30';
      case 'SNACK': return 'from-purple-50/50 to-violet-50/30';
      case 'DINNER': return 'from-blue-50/50 to-indigo-50/30';
      default: return 'from-gray-50/50 to-gray-50/30';
    }
  };

  return (
    <div className={`space-y-4 sm:space-y-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${getSectionBgGradient()} border-2 border-purple-100/50 shadow-lg`}>
      {/* Header with decorative line below */}
      <div>
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getSectionGradient()} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <span className="text-3xl sm:text-4xl filter drop-shadow-lg">{getSectionIcon()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${getSectionGradient()} bg-clip-text text-transparent`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">{suggestions.length} options available</p>
          </div>
        </div>
        {/* Full-width decorative line */}
        <div className={`hidden sm:block h-1 w-full rounded-full bg-gradient-to-r ${getSectionGradient()} opacity-30`}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 items-start">
        {suggestions.map((suggestion) => (
          <MealRecommendationCard
            key={suggestion.id}
            suggestion={suggestion}
            onSelect={onSelect}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
};

export default MealRecommendationCard;
