import React from 'react';

// Contribution options constant
const contributionOptions = [
  { id: 1, label: "Webinar" },
  { id: 2, label: "Mokef" },
  { id: 3, label: "Mentoring" },
  { id: 4, label: "Other" },
];

/**
 * ContributionStep Component
 * Final step for selecting community contributions
 * @param {Object} formData - User form data
 * @param {Function} handleContributionChange - Handler for contribution changes
 * @param {Function} addContribution - Handler to add new contribution
 * @param {Function} removeContribution - Handler to remove contribution
 * @param {Function} onSubmit - Form submission handler
 * @param {boolean} isLoading - Loading state
 */
function ContributionStep({ 
  formData, 
  handleContributionChange, 
  addContribution, 
  removeContribution, 
  onSubmit, 
  isLoading 
}) {
  /**
   * Checks if form has valid contributions
   * @returns {boolean} True if at least one contribution has a type selected
   */
  const hasValidContributions = () => {
    return formData.participantValues && 
           formData.participantValues.length > 0 && 
           formData.participantValues.some(cv => cv.id_community_value);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Contribution</h2>
        <p className="text-gray-600">Please select how you'd like to contribute to our community</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {(formData.participantValues || []).map((contribution, index) => (
          <ContributionEntry
            key={index}
            contribution={contribution}
            index={index}
            canRemove={formData.participantValues.length > 1}
            onChange={handleContributionChange}
            onRemove={() => removeContribution(index)}
          />
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addContribution}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Add Another Contribution
          </button>
        </div>

        {hasValidContributions() && (
          <div className="text-center pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Submitting..." : "Submit Profile"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * ContributionEntry Component
 * Individual contribution entry form
 * @param {Object} contribution - Contribution data
 * @param {number} index - Contribution index in array
 * @param {boolean} canRemove - Whether this entry can be removed
 * @param {Function} onChange - Handler for contribution field changes
 * @param {Function} onRemove - Handler to remove this contribution
 */
function ContributionEntry({ contribution, index, canRemove, onChange, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Contribution #{index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={contribution.id_community_value || ""}
            required
            onChange={(e) => onChange(index, "id_community_value", parseInt(e.target.value))}
          >
            <option value="">Select contribution type</option>
            {contributionOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe your contribution"
            value={contribution.description || ""}
            onChange={(e) => onChange(index, "description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default ContributionStep;