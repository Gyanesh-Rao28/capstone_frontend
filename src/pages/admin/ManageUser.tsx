import { useState, useEffect } from 'react';
import { Users, AlertCircle, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { getAllUsers } from '../../services/adminApi';
import { User, UserRole } from '../../types/user';
import Loading from '../../components/Loading';
import UserSearchFilter from '../../components/adminComponents/UserSearchFilter';
import UserTable from '../../components/adminComponents/UserTable';
import RoleAssignmentModal from '../../components/adminComponents/RoleAssignmentModal';

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Role counts for summary
  const [roleCounts, setRoleCounts] = useState({
    total: 0,
    admin: 0,
    faculty: 0,
    student: 0,
    user: 0
  });

  // State for role assignment modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  useEffect(() => {
    // Calculate role counts whenever users change
    calculateRoleCounts();
  }, [users]);

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

  const calculateRoleCounts = () => {
    const counts = {
      total: users.length,
      admin: 0,
      faculty: 0,
      student: 0,
      user: 0
    };

    users.forEach(user => {
      switch (user.role) {
        case UserRole.admin:
          counts.admin++;
          break;
        case UserRole.faculty:
          counts.faculty++;
          break;
        case UserRole.student:
          counts.student++;
          break;
        case UserRole.user:
          counts.user++;
          break;
      }
    });

    setRoleCounts(counts);
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

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
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

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold">{roleCounts.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-xl font-semibold">{roleCounts.admin}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Faculty</p>
            <p className="text-xl font-semibold">{roleCounts.faculty}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-xl font-semibold">{roleCounts.student}</p>
          </div>
        </div>
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
              {filteredUsers.length} users found
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
            users={currentUsers}
            onAssignRole={handleOpenRoleModal}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            usersPerPage={usersPerPage}
          />
        </>
      )}

      {/* Unified Role Assignment Modal */}
      <RoleAssignmentModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSuccess={handleRoleUpdateSuccess}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageUser;