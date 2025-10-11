import React from 'react';

interface HealthPreferencesStepProps {
  data: any;
  onChange: (data: any) => void;
}

const HealthPreferencesStep: React.FC<HealthPreferencesStepProps> = ({ data, onChange }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language
          </label>
          <select
            value={data.preferredLanguage || 'English'}
            onChange={(e) => handleChange('preferredLanguage', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Bengali">Bengali</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>

        {/* Notification Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Notification Time
          </label>
          <input
            type="time"
            value={data.notificationTime || '08:00'}
            onChange={(e) => handleChange('notificationTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Stress Level
          </label>
          <select
            value={data.stressLevel || ''}
            onChange={(e) => handleChange('stressLevel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sleep Quality
          </label>
          <select
            value={data.sleepQuality || ''}
            onChange={(e) => handleChange('sleepQuality', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select quality</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>

        {/* Water Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Water Intake (liters)
          </label>
          <input
            type="number"
            value={data.waterIntakeLiters || ''}
            onChange={(e) => handleChange('waterIntakeLiters', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 2"
            min="1"
            max="5"
            step="0.5"
          />
        </div>
      </div>

      {/* Support Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Support Preferences (select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Nutrition guidance',
            'Exercise tips',
            'Mental health support',
            'Doctor reminders',
            'Medication reminders',
            'Educational content',
            'Community support',
            'Emergency assistance'
          ].map((preference) => (
            <label key={preference} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.supportPreferences || []).includes(preference)}
                onChange={() => handleArrayChange('supportPreferences', preference)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{preference}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> We'll use these preferences to customize your experience and send timely reminders.
        </p>
      </div>
    </div>
  );
};

export default HealthPreferencesStep;
