import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useDataApi from './UseDataApi';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const USE_MOCK_DATA = true;

const mockMembers = [
  {
    id: 1,
    name: 'Dana Cohen',
    position: 'Full Stack Developer',
    company: 'CloudTech',
    location: 'Tel Aviv',
    education: 'B.Sc',
    experience: '3-5 years',
    skills: ['JavaScript', 'React', 'Node.js'],
    image: 'https://via.placeholder.com/100x100?text=Dana'
  },
  {
    id: 2,
    name: 'Elad Ron',
    position: 'Data Analyst',
    company: 'DataWorks',
    location: 'Haifa',
    education: 'M.Sc',
    experience: '5-7 years',
    skills: ['Python', 'SQL', 'Tableau'],
    image: 'https://via.placeholder.com/100x100?text=Elad'
  },
  {
    id: 3,
    name: 'Ronit Avital',
    position: 'HR Manager',
    company: 'PeopleFirst',
    location: 'Jerusalem',
    education: 'B.A.',
    experience: '10+ years',
    skills: ['HR', 'Recruiting', 'Leadership'],
    image: 'https://via.placeholder.com/100x100?text=Ronit'
  }
];

const ICONS = {
  company: <Briefcase className="w-4 h-4 ml-1" />,
  location: <MapPin className="w-4 h-4 ml-1" />,
  experience: <Calendar className="w-4 h-4 ml-1" />
};

const CommunityMembersPage = () => {
  const { id: communityId } = useParams();
  const [{ data, isLoading, isError }, setUrl] = useDataApi('', []);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      setUrl(`/api/community/${communityId}/members`);
    }
  }, [communityId]);

  const members = USE_MOCK_DATA ? mockMembers : data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Community Members (ID: {communityId})
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Error loading data</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {members.map(member => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ml-3"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">{member.name}</h2>
                    <p className="text-blue-600 text-xs">{member.position}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  {['company', 'location', 'experience'].map(key => (
                    <p key={key} className="flex items-center">
                      {ICONS[key]}
                      {member[key]}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                      +{member.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityMembersPage;
