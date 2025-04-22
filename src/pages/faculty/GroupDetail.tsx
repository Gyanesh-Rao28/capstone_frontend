// src/pages/faculty/GroupDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { getGroupById } from '../../services/facultyApi';

interface StudentMember {
  memberRole: string;
  student: {
    studentId: string;
    user: {
      name: string;
      email: string;
    };
  };
}

interface GroupDetail {
  project: {
    id: string;
    facultyId: string;
    title: string;
    description: string;
  };
  members: StudentMember[];
}

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);
        if (!groupId) return;
        
        const response = await getGroupById(groupId);
        setGroup(response.data);
      } catch (err) {
        setError('Failed to load group details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroup();
  }, [groupId]);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !group) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error || 'Group not found'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-blue-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{group.project.title}</h3>
              <p className="text-gray-700">{group.project.description}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-green-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Group Members</h2>
              </div>
              <p className="text-gray-600">{group.members.length} members in this group</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {group.members.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {member.student.user.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {member.memberRole}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">ID: {member.student.studentId}</div>
                      <div>{member.student.user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;