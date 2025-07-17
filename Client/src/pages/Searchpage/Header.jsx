// import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown, Loader2 } from 'lucide-react';

const Header = () => (
  <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
      Search for users and groups
    </h1>
    <p className="text-center text-gray-600 text-lg">
      Find the right people and groups for you by name and group membership
    </p>
  </div>
);
export default Header;