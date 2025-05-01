import { User, UserRole } from '../../types/user';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserTableProps {
    users: User[];
    onAssignRole: (user: User) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    usersPerPage: number;
}

const UserTable = ({
    users,
    onAssignRole,
    currentPage,
    totalPages,
    onPageChange,
    usersPerPage
}: UserTableProps) => {
    // Function to check if a user can be assigned a role
    const canAssignRole = (user: User) => {
        // Only users with basic 'user' role can be assigned to faculty, admin, or student
        return user.role === UserRole.user;
    };

    // Calculate the range of users being displayed
    const startRange = (currentPage - 1) * usersPerPage + 1;
    const endRange = Math.min(currentPage * usersPerPage, users.length);

    // Get role badge class
    const getRoleBadgeClass = (role: UserRole) => {
        switch (role) {
            case UserRole.admin:
                return 'bg-red-100 text-red-800';
            case UserRole.faculty:
                return 'bg-blue-100 text-blue-800';
            case UserRole.student:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {user.profilePicture ? (
                                            <img className="h-10 w-10 rounded-full" src={user.profilePicture} alt={user.name} />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[200px] md:max-w-[300px]">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                                        <span className="capitalize">{user.role}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.role === UserRole.faculty && user.faculty ? (
                                        <div>
                                            <p>Department: {user.faculty.department || 'N/A'}</p>
                                            <p>Designation: {user.faculty.designation || 'N/A'}</p>
                                        </div>
                                    ) : user.role === UserRole.student && user.student ? (
                                        <div>
                                            <p>Student ID: {user.student.studentId}</p>
                                            <p>Batch: {user.student.batch || 'N/A'}</p>
                                        </div>
                                    ) : user.role === UserRole.admin && user.admin ? (
                                        <div>
                                            <p>Admin ID: {user.admin.id.substring(0, 8)}...</p>
                                        </div>
                                    ) : (
                                        <p>No additional details</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {canAssignRole(user) ? (
                                        <button
                                            onClick={() => onAssignRole(user)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Assign Role
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Role assigned</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 ? (
                <div className="py-6 px-4 text-center">
                    <p className="text-gray-500">No users found</p>
                </div>
            ) : (
                <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                        Showing {startRange} to {endRange} of {users.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Page Number Buttons */}
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 rounded-md ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md ${currentPage === totalPages
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;