import React from 'react';

/**
 * TabNavigation Component
 * Renders navigation tabs for profile sections
 * @param {string} activeTab - Currently active tab
 * @param {Function} setActiveTab - Handler to change active tab
 */
function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "contact", label: "Contact", icon: "📞" },
    { key: "about", label: "About", icon: "👤" },
    { key: "experience", label: "Experience", icon: "💼" },
    { key: "skills", label: "Skills", icon: "🎯" }
  ];

  return (
    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
      <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;