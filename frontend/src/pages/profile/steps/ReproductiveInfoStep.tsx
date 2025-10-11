import React from 'react';

interface ReproductiveInfoStepProps {
  data: any;
  onChange: (data: any) => void;
}

const ReproductiveInfoStep: React.FC<ReproductiveInfoStepProps> = ({ data, onChange }) => {
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
        {/* Last Period Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Period Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={data.lastPeriodDate || ''}
            onChange={(e) => handleChange('lastPeriodDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Average Cycle Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Cycle Length (days)
          </label>
          <input
            type="number"
            value={data.averageCycleLength || 28}
            onChange={(e) => handleChange('averageCycleLength', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="28"
            min="21"
            max="35"
          />
        </div>

        {/* Past Pregnancies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Past Pregnancies
          </label>
          <input
            type="number"
            value={data.pastPregnancies || 0}
            onChange={(e) => handleChange('pastPregnancies', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="0"
            min="0"
            max="15"
          />
        </div>

        {/* Miscarriages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Miscarriages
          </label>
          <input
            type="number"
            value={data.miscarriages || 0}
            onChange={(e) => handleChange('miscarriages', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="0"
            min="0"
            max="10"
          />
        </div>

        {/* Pregnancy Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pregnancy Type
          </label>
          <select
            value={data.pregnancyType || ''}
            onChange={(e) => handleChange('pregnancyType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="Natural">Natural</option>
            <option value="IVF">IVF</option>
            <option value="IUI">IUI</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Expected Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Due Date
          </label>
          <input
            type="date"
            value={data.expectedDueDate || ''}
            onChange={(e) => handleChange('expectedDueDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Trimester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Trimester
          </label>
          <select
            value={data.trimester || ''}
            onChange={(e) => handleChange('trimester', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select trimester</option>
            <option value="1">First Trimester (1-13 weeks)</option>
            <option value="2">Second Trimester (14-26 weeks)</option>
            <option value="3">Third Trimester (27-40 weeks)</option>
          </select>
        </div>

        {/* Doctor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor's Name
          </label>
          <input
            type="text"
            value={data.doctorName || ''}
            onChange={(e) => handleChange('doctorName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., Dr. Meera Sethi"
          />
        </div>

        {/* Hospital */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital/Clinic Name
          </label>
          <input
            type="text"
            value={data.hospital || ''}
            onChange={(e) => handleChange('hospital', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., City Women's Hospital"
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Pressure
          </label>
          <input
            type="text"
            value={data.bloodPressure || ''}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 120/80"
          />
        </div>

        {/* Sugar Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sugar Level
          </label>
          <select
            value={data.sugarLevel || ''}
            onChange={(e) => handleChange('sugarLevel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
            <option value="Diabetic">Diabetic</option>
          </select>
        </div>
      </div>

      {/* Complications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Any Complications (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Anemia', 'Gestational Diabetes', 'Preeclampsia', 'Thyroid Issues', 'High BP', 'Other'].map((complication) => (
            <label key={complication} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.complications || []).includes(complication)}
                onChange={() => handleArrayChange('complications', complication)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{complication}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <p className="text-sm text-purple-700">
          <strong>Tip:</strong> Keep track of your pregnancy milestones to receive personalized care and reminders.
        </p>
      </div>
    </div>
  );
};

export default ReproductiveInfoStep;
