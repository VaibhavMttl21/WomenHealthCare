import React from 'react';

interface NutritionInfoStepProps {
  data: any;
  onChange: (data: any) => void;
}

const NutritionInfoStep: React.FC<NutritionInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (field: string, value: string) => {
    const arr = data[field] || [];
    if (arr.includes(value)) {
      onChange({ ...data, [field]: arr.filter((v: string) => v !== value) });
    } else {
      onChange({ ...data, [field]: [...arr, value] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dietary Restrictions (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Lactose intolerant',
            'Gluten intolerant',
            'Nut allergy',
            'Seafood allergy',
            'Egg allergy',
            'Soy allergy',
            'Religious restrictions',
            'None'
          ].map((restriction) => (
            <label key={restriction} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.dietaryRestrictions || []).includes(restriction)}
                onChange={() => handleArrayChange('dietaryRestrictions', restriction)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{restriction}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Favorite Foods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Favorite Foods (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Fruits',
            'Vegetables',
            'Rice',
            'Wheat/Roti',
            'Paneer',
            'Dairy',
            'Lentils/Dal',
            'Eggs',
            'Chicken',
            'Fish',
            'Nuts',
            'Sweets'
          ].map((food) => (
            <label key={food} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.favoriteFoods || []).includes(food)}
                onChange={() => handleArrayChange('favoriteFoods', food)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{food}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nutritional Deficiencies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Known Nutritional Deficiencies (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Iron',
            'Calcium',
            'Vitamin D',
            'Vitamin B12',
            'Folic Acid',
            'Protein',
            'Iodine',
            'None'
          ].map((deficiency) => (
            <label key={deficiency} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.deficiencies || []).includes(deficiency)}
                onChange={() => handleArrayChange('deficiencies', deficiency)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{deficiency}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Current Supplements (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Iron',
            'Calcium',
            'Folic Acid',
            'Vitamin D',
            'Multivitamin',
            'Omega-3',
            'Probiotics',
            'None'
          ].map((supplement) => (
            <label key={supplement} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.supplements || []).includes(supplement)}
                onChange={() => handleArrayChange('supplements', supplement)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{supplement}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <p className="text-sm text-green-700">
          <strong>Tip:</strong> Maintaining a balanced diet is crucial during pregnancy. We'll provide personalized meal plans based on your preferences.
        </p>
      </div>
    </div>
  );
};

export default NutritionInfoStep;
