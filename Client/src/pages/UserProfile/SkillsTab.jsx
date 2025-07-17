import React from 'react';

/**
 * SkillsTab Component
 * Manages skills entries with add/remove functionality
 * @param {Object} formData - User form data
 * @param {Function} handleSkillChange - Handler for skill changes
 * @param {Function} addSkill - Handler to add new skill
 * @param {Function} removeSkill - Handler to remove skill
 */
function SkillsTab({ formData, handleSkillChange, addSkill, removeSkill }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Skills & Expertise</h3>
        <button
          type="button"
          onClick={addSkill}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          + Add Skill
        </button>
      </div>
      
      {formData.skills.length === 0 ? (
        <EmptySkillsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.skills.map((skill, index) => (
            <SkillEntry
              key={index}
              skill={skill}
              index={index}
              onChange={handleSkillChange}
              onRemove={() => removeSkill(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * EmptySkillsState Component
 * Displays placeholder when no skills are added
 */
function EmptySkillsState() {
  return (
    <div className="text-center py-12 text-gray-500">
      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <p>No skills added yet</p>
    </div>
  );
}

/**
 * SkillEntry Component
 * Individual skill input with remove button
 * @param {string} skill - Skill value
 * @param {number} index - Skill index in array
 * @param {Function} onChange - Handler for skill value change
 * @param {Function} onRemove - Handler to remove this skill
 */
function SkillEntry({ skill, index, onChange, onRemove }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        value={skill}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Enter a skill"
      />
      <button
        type="button"
        onClick={onRemove}
        className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

export default SkillsTab;