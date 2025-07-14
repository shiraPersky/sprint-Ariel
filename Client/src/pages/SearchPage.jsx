import React, { useState } from 'react';
import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown } from 'lucide-react';

const UserSearchComponent = () => {
  const [searchMode, setSearchMode] = useState('users');
  const [searchFilters, setSearchFilters] = useState({});
  
  const [checkboxFilters, setCheckboxFilters] = useState({
    experience: [],
    education: [],
    industry: [],
    skills: [],
    location: []
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    experience: false,
    education: false,
    industry: false,
    skills: false,
    location: false
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'דוד כהן',
      position: 'מפתח תוכנה בכיר',
      company: 'טכנולוגיות אלפא',
      location: 'תל אביב',
      education: 'תואר ראשון',
      experience: '5-7 שנים',
      skills: ['React', 'Node.js', 'Python'],
      industry: 'טכנולוגיה',
      image: 'https://via.placeholder.com/100x100?text=דוד'
    },
    {
      id: 2,
      name: 'שרה לוי',
      position: 'מנהלת מוצר',
      company: 'סטארט-אפ חדשני',
      location: 'חיפה',
      education: 'תואר שני',
      experience: '7-10 שנים',
      skills: ['Product Management', 'UX', 'Analytics'],
      industry: 'טכנולוגיה',
      image: 'https://via.placeholder.com/100x100?text=שרה'
    },
    {
      id: 3,
      name: 'יוסף גרין',
      position: 'מעצב UX/UI',
      company: 'סטודיו עיצוב',
      location: 'ירושלים',
      education: 'תואר ראשון',
      experience: '3-5 שנים',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      industry: 'עיצוב',
      image: 'https://via.placeholder.com/100x100?text=יוסף'
    },
    {
      id: 4,
      name: 'מיכל רוזן',
      position: 'מנהלת פרויקטים',
      company: 'חברת ייעוץ',
      location: 'תל אביב',
      education: 'תואר שני',
      experience: '10+ שנים',
      skills: ['Project Management', 'Agile', 'Leadership'],
      industry: 'ייעוץ',
      image: 'https://via.placeholder.com/100x100?text=מיכל'
    }
  ]);

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'מפתחי React ישראל',
      members: 1250,
      category: 'טכנולוגיה',
      description: 'קהילת מפתחי React הגדולה בישראל',
      image: 'https://via.placeholder.com/150x100?text=React+IL',
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 2,
      name: 'מנהלי מוצר תל אביב',
      members: 850,
      category: 'ניהול מוצר',
      description: 'רשת מנהלי מוצר במרכז',
      image: 'https://via.placeholder.com/150x100?text=PM+TLV',
      tags: ['Product Management', 'Strategy', 'Analytics']
    },
    {
      id: 3,
      name: 'מעצבי UX/UI ירושלים',
      members: 420,
      category: 'עיצוב',
      description: 'קהילת מעצבים בירושלים',
      image: 'https://via.placeholder.com/150x100?text=UX+JLM',
      tags: ['UX', 'UI', 'Design']
    },
    {
      id: 4,
      name: 'סטארט-אפ חיפה',
      members: 650,
      category: 'יזמות',
      description: 'יזמים וסטארט-אפיסטים בצפון',
      image: 'https://via.placeholder.com/150x100?text=Startup+HFA',
      tags: ['Entrepreneurship', 'Innovation', 'Networking']
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredGroups, setFilteredGroups] = useState(groups);

  // Filter options
  const filterOptions = {
    experience: ['1-2 שנים', '3-5 שנים', '5-7 שנים', '7-10 שנים', '10+ שנים'],
    education: ['תואר ראשון', 'תואר שני', 'תואר שלישי', 'קורסים מקצועיים'],
    industry: ['טכנולוגיה', 'עיצוב', 'ייעוץ', 'ניהול מוצר', 'יזמות', 'שיווק'],
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'Product Management', 'UX', 'UI', 'Analytics', 'Figma', 'Leadership'],
    location: ['תל אביב', 'חיפה', 'ירושלים', 'באר שבע', 'אשדוד', 'נתניה']
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...searchFilters, [field]: value };
    setSearchFilters(newFilters);
    applyFilters(newFilters, checkboxFilters);
  };

  const toggleDropdown = (category) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCheckboxChange = (category, value) => {
    const newCheckboxFilters = { ...checkboxFilters };
    if (newCheckboxFilters[category].includes(value)) {
      newCheckboxFilters[category] = newCheckboxFilters[category].filter(item => item !== value);
    } else {
      newCheckboxFilters[category].push(value);
    }
    setCheckboxFilters(newCheckboxFilters);
    applyFilters(searchFilters, newCheckboxFilters);
  };

  const applyFilters = (textFilters, checkFilters) => {
    // Filter users
    const filteredUserResults = users.filter(user => {
      // Checkbox filters only
      const checkboxMatch = Object.keys(checkFilters).every(category => {
        if (checkFilters[category].length === 0) return true;
        if (category === 'skills') {
          return checkFilters[category].some(skill => user.skills.includes(skill));
        }
        return checkFilters[category].includes(user[category]);
      });

      return checkboxMatch;
    });

    // Filter groups
    const filteredGroupResults = groups.filter(group => {
      // For groups, we can filter by category and tags
      const categoryMatch = checkFilters.industry.length === 0 || 
        checkFilters.industry.some(industry => group.category.includes(industry));
      
      const tagsMatch = checkFilters.skills.length === 0 ||
        checkFilters.skills.some(skill => group.tags.includes(skill));

      return categoryMatch || tagsMatch;
    });

    setFilteredUsers(filteredUserResults);
    setFilteredGroups(filteredGroupResults);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
      alert(`קובץ ${file.name} הועלה בהצלחה! (בפרויקט אמיתי כאן יהיה parsing של האקסל)`);
    }
  };

  const clearFilters = () => {
    setSearchFilters({});
    setCheckboxFilters({
      experience: [],
      education: [],
      industry: [],
      skills: [],
      location: []
    });
    setOpenDropdowns({
      experience: false,
      education: false,
      industry: false,
      skills: false,
      location: false
    });
    setFilteredUsers(users);
    setFilteredGroups(groups);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            חיפוש משתמשים וקבוצות
          </h1>
          <p className="text-center text-gray-600 text-lg">
            מצא את האנשים והקבוצות המתאימים עבורך עם מערכת חיפוש מתקדמת
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-full p-2">
              <button
                onClick={() => setSearchMode('users')}
                className={`flex items-center px-6 py-3 rounded-full transition-all ${
                  searchMode === 'users'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="w-5 h-5 ml-2" />
                חיפוש משתמשים
              </button>
              <button
                onClick={() => setSearchMode('groups')}
                className={`flex items-center px-6 py-3 rounded-full transition-all ${
                  searchMode === 'groups'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-5 h-5 ml-2" />
                חיפוש קבוצות
              </button>
            </div>
          </div>

          {/* Compact Dropdown Filters */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Filter className="w-5 h-5 ml-2" />
              פילטרים מתקדמים
            </h3>
            
            <div className="flex flex-wrap gap-4">
              {/* Experience Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('experience')}
                  className="flex items-center justify-between min-w-[150px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium">
                    <Calendar className="w-4 h-4 ml-2" />
                    ניסיון {checkboxFilters.experience.length > 0 && `(${checkboxFilters.experience.length})`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.experience ? 'rotate-180' : ''}`} />
                </button>
                {openDropdowns.experience && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filterOptions.experience.map(option => (
                      <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkboxFilters.experience.includes(option)}
                          onChange={() => handleCheckboxChange('experience', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('education')}
                  className="flex items-center justify-between min-w-[150px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium">
                    <GraduationCap className="w-4 h-4 ml-2" />
                    השכלה {checkboxFilters.education.length > 0 && `(${checkboxFilters.education.length})`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.education ? 'rotate-180' : ''}`} />
                </button>
                {openDropdowns.education && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filterOptions.education.map(option => (
                      <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkboxFilters.education.includes(option)}
                          onChange={() => handleCheckboxChange('education', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('industry')}
                  className="flex items-center justify-between min-w-[150px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium">
                    <Building className="w-4 h-4 ml-2" />
                    תחום {checkboxFilters.industry.length > 0 && `(${checkboxFilters.industry.length})`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.industry ? 'rotate-180' : ''}`} />
                </button>
                {openDropdowns.industry && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filterOptions.industry.map(option => (
                      <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkboxFilters.industry.includes(option)}
                          onChange={() => handleCheckboxChange('industry', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('skills')}
                  className="flex items-center justify-between min-w-[150px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium">
                    <Award className="w-4 h-4 ml-2" />
                    כישורים {checkboxFilters.skills.length > 0 && `(${checkboxFilters.skills.length})`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.skills ? 'rotate-180' : ''}`} />
                </button>
                {openDropdowns.skills && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filterOptions.skills.map(option => (
                      <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkboxFilters.skills.includes(option)}
                          onChange={() => handleCheckboxChange('skills', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('location')}
                  className="flex items-center justify-between min-w-[150px] px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium">
                    <MapPin className="w-4 h-4 ml-2" />
                    מיקום {checkboxFilters.location.length > 0 && `(${checkboxFilters.location.length})`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdowns.location ? 'rotate-180' : ''}`} />
                </button>
                {openDropdowns.location && (
                      < div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">

                  {/* // <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"> */}
                    {filterOptions.location.map(option => (
                      <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkboxFilters.location.includes(option)}
                          onChange={() => handleCheckboxChange('location', option)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ml-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={clearFilters}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all transform hover:scale-105"
            >
              <Filter className="w-5 h-5 ml-2" />
              נקה פילטרים
            </button>
            <button className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105">
              <Search className="w-5 h-5 ml-2" />
              חפש
            </button>
          </div>

          {/* Users Results */}
          {searchMode === 'users' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                תוצאות חיפוש משתמשים ({filteredUsers.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ml-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-800 truncate">{user.name}</h3>
                        <p className="text-blue-600 font-medium text-xs truncate">{user.position}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p className="flex items-center truncate">
                        <Briefcase className="w-3 h-3 ml-1 flex-shrink-0" />
                        <span className="truncate">{user.company}</span>
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 ml-1 flex-shrink-0" />
                        <span>{user.location}</span>
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-3 h-3 ml-1 flex-shrink-0" />
                        <span>{user.experience}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{user.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Results */}
          {searchMode === 'groups' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                תוצאות חיפוש קבוצות ({filteredGroups.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGroups.map(group => (
                  <div key={group.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4">
                    <div className="mb-3">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{group.name}</h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{group.description}</p>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p className="flex items-center">
                        <Users className="w-3 h-3 ml-1 flex-shrink-0" />
                        <span>{group.members.toLocaleString()} חברים</span>
                      </p>
                      <p className="flex items-center">
                        <Building className="w-3 h-3 ml-1 flex-shrink-0" />
                        <span>{group.category}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {group.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {group.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{group.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-xs font-medium">
                      הצטרף לקבוצה
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            העלאת קובץ אקסל
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              גרור קובץ אקסל לכאן או לחץ לבחירת קובץ
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl cursor-pointer transition-all transform hover:scale-105"
            >
              <Upload className="w-5 h-5 ml-2" />
              בחר קובץ אקסל
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchComponent;