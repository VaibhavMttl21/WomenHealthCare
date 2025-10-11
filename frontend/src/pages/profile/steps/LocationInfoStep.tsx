import React from 'react';

interface LocationInfoStepProps {
  data: any;
  onChange: (data: any) => void;
}

const LocationInfoStep: React.FC<LocationInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Address
        </label>
        <textarea
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          rows={3}
          placeholder="Enter your complete address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Village/Town */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village/Town <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., Rampur"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., Varanasi"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={data.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Select state</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 221001"
            maxLength={6}
            pattern="[0-9]{6}"
          />
        </div>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
        <p className="text-sm text-indigo-700">
          <strong>Note:</strong> Location information helps us connect you with nearby healthcare facilities and services.
        </p>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">✨</span>
          <h3 className="text-lg font-semibold text-gray-800">
            You're Almost There!
          </h3>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          Complete your profile to unlock personalized health recommendations, timely reminders, and connect with healthcare professionals in your area.
        </p>
        <ul className="text-xs text-gray-600 space-y-1 ml-4">
          <li>✓ Personalized meal plans</li>
          <li>✓ Pregnancy milestone tracking</li>
          <li>✓ Appointment reminders</li>
          <li>✓ 24/7 health chatbot support</li>
          <li>✓ Emergency assistance</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationInfoStep;
