import React from 'react';

/**
 * ExperienceTab Component
 * Manages work experience entries with add/remove functionality
 * @param {Object} formData - User form data
 * @param {Function} handleJobChange - Handler for job field changes
 * @param {Function} addJob - Handler to add new job entry
 * @param {Function} removeJob - Handler to remove job entry
 */
function ExperienceTab({ formData, handleJobChange, addJob, removeJob }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
        <button
          type="button"
          onClick={addJob}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          + Add Experience
        </button>
      </div>
      
      {formData.jobs.length === 0 ? (
        <EmptyExperienceState />
      ) : (
        <div className="space-y-4">
          {formData.jobs.map((job, index) => (
            <JobEntry
              key={index}
              job={job}
              index={index}
              onJobChange={handleJobChange}
              onRemove={() => removeJob(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * EmptyExperienceState Component
 * Displays placeholder when no work experience is added
 */
function EmptyExperienceState() {
  return (
    <div className="text-center py-12 text-gray-500">
      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0a2 2 0 012 2v6.294a2 2 0 01-.76 1.569l-3.5 2.8a2 2 0 01-2.48 0l-3.5-2.8A2 2 0 018 14.294V8a2 2 0 012-2" />
      </svg>
      <p>No work experience added yet</p>
    </div>
  );
}

/**
 * JobEntry Component
 * Individual job experience entry form
 * @param {Object} job - Job data
 * @param {number} index - Job index in array
 * @param {Function} onJobChange - Handler for job field changes
 * @param {Function} onRemove - Handler to remove this job
 */
function JobEntry({ job, index, onJobChange, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Experience #{index + 1}</h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Remove
        </button>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Company Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={job.company_name}
          onChange={(e) => onJobChange(index, "company_name", e.target.value)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={job.start_date}
              onChange={(e) => onJobChange(index, "start_date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={job.end_date}
              onChange={(e) => onJobChange(index, "end_date", e.target.value)}
            />
          </div>
        </div>
        
        <textarea
          placeholder="Job description, responsibilities, and achievements..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows="3"
          value={job.description}
          onChange={(e) => onJobChange(index, "description", e.target.value)}
        />
      </div>
    </div>
  );
}

export default ExperienceTab;