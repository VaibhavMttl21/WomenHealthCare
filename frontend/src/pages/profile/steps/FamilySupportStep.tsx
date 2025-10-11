import React from 'react';

interface FamilySupportStepProps {
  data: any;
  onChange: (data: any) => void;
}

const FamilySupportStep: React.FC<FamilySupportStepProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSpouseChange = (field: string, value: string) => {
    const spouse = data.spouse || {};
    onChange({ ...data, spouse: { ...spouse, [field]: value } });
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
      {/* Spouse Information */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👨‍❤️‍👩 Spouse/Partner Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={data.spouse?.name || ''}
              onChange={(e) => handleSpouseChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Amit Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={data.spouse?.phone || ''}
              onChange={(e) => handleSpouseChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              value={data.spouse?.bloodGroup || ''}
              onChange={(e) => handleSpouseChange('bloodGroup', e.target.value)}
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
        </div>
      </div>

      {/* Primary Caregiver Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Caregiver Contact (for emergencies)
        </label>
        <input
          type="tel"
          value={data.primaryCaregiverContact || ''}
          onChange={(e) => handleChange('primaryCaregiverContact', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="+91-9998887777"
        />
        <p className="text-xs text-gray-500 mt-1">
          This could be a parent, sibling, or close friend
        </p>
      </div>

      {/* Number of Dependents */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Dependents (including children and elderly)
        </label>
        <input
          type="number"
          value={data.dependentsCount || ''}
          onChange={(e) => handleChange('dependentsCount', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="0"
          min="0"
          max="10"
        />
      </div>

      {/* Family Medical History */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Family Medical History (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Diabetes',
            'Hypertension',
            'Heart Disease',
            'Thyroid Issues',
            'Cancer',
            'Asthma',
            'Mental Health Issues',
            'Genetic Disorders',
            'None'
          ].map((condition) => (
            <label key={condition} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.familyHistory || []).includes(condition)}
                onChange={() => handleArrayChange('familyHistory', condition)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Privacy Note:</strong> Your family information is kept confidential and used only for emergency situations and better care planning.
        </p>
      </div>
    </div>
  );
};

export default FamilySupportStep;
