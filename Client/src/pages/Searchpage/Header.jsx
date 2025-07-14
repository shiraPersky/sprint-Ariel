import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Upload, Filter, MapPin, Briefcase, GraduationCap, Calendar, Building, Award, ChevronDown, Loader2 } from 'lucide-react';

// קומפוננט Header
const Header = () => (
  <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
      חיפוש משתמשים וקבוצות
    </h1>
    <p className="text-center text-gray-600 text-lg">
      מצא את האנשים והקבוצות המתאימים עבורך לפי שם ושייכות לקבוצות
    </p>
  </div>
);
export default Header;