import React from 'react';
import { Users, Building, Tag } from 'lucide-react';

/**
 * GroupHeader Component
 * Displays group information including image, name, description, and metadata
 * @param {Object} group - Group data object
 * @param {number} memberCount - Number of members in the group
 */
function GroupHeader({ group, memberCount }) {
  /**
   * Handle image loading errors by using fallback placeholder
   * @param {Event} e - Image error event
   */
  const handleImageError = (e) => {
    console.log('Image failed to load, using fallback');
    e.target.src = '/api/placeholder/128/96';
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        
        {/* Group Image */}
        <div className="flex-shrink-0">
          <img
            src={group.image || group.group_image || '/api/placeholder/128/96'}
            alt={group.group_name || group.name || 'Group Image'}
            className="w-32 h-24 object-cover rounded-xl shadow-md"
            onError={handleImageError}
          />
        </div>
        
        {/* Group Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {group.group_name || group.name || 'Unnamed Group'}
          </h1>
          
          {group.description && (
            <p className="text-gray-600 text-lg mb-4">{group.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>Members: {memberCount}</span>
            </div>
            
            {group.category && (
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                <span>{group.category}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupHeader;