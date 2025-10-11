import React from 'react';

interface PersonalInfoStepProps {
  data: any;
  onChange: (data: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your age"
            min="18"
            max="60"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.heightCm || ''}
            onChange={(e) => handleChange('heightCm', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 162"
            min="140"
            max="200"
            step="0.1"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.weightKg || ''}
            onChange={(e) => handleChange('weightKg', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 68"
            min="35"
            max="150"
            step="0.1"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group <span className="text-red-500">*</span>
          </label>
          <select
            value={data.bloodGroup || ''}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={data.maritalStatus || ''}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="Married">Married</option>
            <option value="Single">Single</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Children Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Children
          </label>
          <input
            type="number"
            value={data.childrenCount || ''}
            onChange={(e) => handleChange('childrenCount', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="0"
            min="0"
            max="15"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={data.occupation || ''}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., Teacher, Homemaker"
          />
        </div>

        {/* Dietary Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Preference
          </label>
          <select
            value={data.dietaryPreference || ''}
            onChange={(e) => handleChange('dietaryPreference', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Eggetarian">Eggetarian</option>
          </select>
        </div>

        {/* Exercise Habits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Habits
          </label>
          <select
            value={data.exerciseHabits || ''}
            onChange={(e) => handleChange('exerciseHabits', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select frequency</option>
            <option value="Daily">Daily</option>
            <option value="Often">Often (4-5 times/week)</option>
            <option value="Occasionally">Occasionally (1-3 times/week)</option>
            <option value="Never">Never</option>
          </select>
        </div>

        {/* Sleep Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Sleep Hours
          </label>
          <input
            type="number"
            value={data.sleepHours || ''}
            onChange={(e) => handleChange('sleepHours', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 7"
            min="3"
            max="12"
            step="0.5"
          />
        </div>
      </div>

      {/* Smoking */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.smoking || false}
            onChange={(e) => handleChange('smoking', e.target.checked)}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm font-medium text-gray-700">I smoke</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.alcohol || false}
            onChange={(e) => handleChange('alcohol', e.target.checked)}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm font-medium text-gray-700">I consume alcohol</span>
        </label>
      </div>

      <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
        <p className="text-sm text-pink-700">
          <strong>Note:</strong> This information helps us provide personalized care recommendations.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
