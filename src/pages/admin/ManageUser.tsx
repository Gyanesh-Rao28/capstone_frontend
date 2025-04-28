import { useState, useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { getAllUsers } from '../../services/adminApi';
import { User } from '../../types/user';
import Loading from '../../components/Loading';
import UserSearchFilter from '../../components/adminComponents/UserSearchFilter';
import UserTable from '../../components/adminComponents/UserTable';
import { AdminRoleModal, FacultyRoleModal, StudentRoleModal } from '../../components/adminComponents/FacultyRoleModal';

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for role assignment modals
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Filter by role
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(result);
  };

  const handleOpenFacultyModal = (user: User) => {
    setSelectedUser(user);
    setIsFacultyModalOpen(true);
  };

  const handleOpenStudentModal = (user: User) => {
    setSelectedUser(user);
    setIsStudentModalOpen(true);
  };

  const handleOpenAdminModal = (user: User) => {
    setSelectedUser(user);
    setIsAdminModalOpen(true);
  };

  const handleRoleUpdateSuccess = () => {
    fetchUsers(); // Refresh user list
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 overflow-y-auto max-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Manage Users
        </h1>
        <p className="text-gray-600 mt-1">View and manage user roles and permissions</p>
      </div>

      {/* Search and Filter */}
      <UserSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loading />
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {selectedRole && <span> with role "{selectedRole}"</span>}
            </p>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          <UserTable
            users={filteredUsers}
            onAssignFaculty={handleOpenFacultyModal}
            onAssignStudent={handleOpenStudentModal}
            onAssignAdmin={handleOpenAdminModal}
          />
        </>
      )}

      {/* Role Assignment Modals */}
      <FacultyRoleModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSuccess={handleRoleUpdateSuccess}
        user={selectedUser}
      />

      <StudentRoleModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSuccess={handleRoleUpdateSuccess}
        user={selectedUser}
      />

      <AdminRoleModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleRoleUpdateSuccess}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageUser;