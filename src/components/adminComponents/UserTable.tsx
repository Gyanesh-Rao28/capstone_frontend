import { User, UserRole } from '../../types/user';
import { Briefcase, GraduationCap, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
    users: User[];
    onAssignFaculty: (user: User) => void;
    onAssignStudent: (user: User) => void;
    onAssignAdmin: (user: User) => void;
}

const UserTable = ({ users, onAssignFaculty, onAssignStudent, onAssignAdmin }: UserTableProps) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (userId: string) => {
        if (activeDropdown === userId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(userId);
        }
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };

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

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.admin:
                return <ShieldCheck className="h-4 w-4" />;
            case UserRole.faculty:
                return <Briefcase className="h-4 w-4" />;
            case UserRole.student:
                return <GraduationCap className="h-4 w-4" />;
            default:
                return null;
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
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                                        <span className="flex items-center">
                                            {getRoleIcon(user.role)}
                                            <span className="ml-1 capitalize">{user.role}</span>
                                        </span>
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                    <button
                                        onClick={() => toggleDropdown(user.id)}
                                        className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                    {activeDropdown === user.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={closeDropdown}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => {
                                                            onAssignFaculty(user);
                                                            closeDropdown();
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                                                        Assign Faculty Role
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onAssignStudent(user);
                                                            closeDropdown();
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <GraduationCap className="h-4 w-4 mr-2 text-green-600" />
                                                        Assign Student Role
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onAssignAdmin(user);
                                                            closeDropdown();
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <ShieldCheck className="h-4 w-4 mr-2 text-red-600" />
                                                        Assign Admin Role
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="py-6 px-4 text-center">
                    <p className="text-gray-500">No users found</p>
                </div>
            )}
        </div>
    );
};

export default UserTable;