
import { useAuth } from "../hooks/useAuth";
import { User, Shield, Mail, Key, KeyRound, IdCard } from 'lucide-react';

import { UserRole } from "../types/enum";

const Dashboard = () => {
    const { user } = useAuth();

    // console.log(user)

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Header Section */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Portal</h1>
                    
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex items-center space-x-6">
                            <img
                                src={user?.profilePicture || "/api/placeholder/96/96"}
                                alt={user?.name}
                                className="h-24 w-24 rounded-full border-4 border-gray-100 shadow-sm"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">Welcome back to your dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info Grid */}
                    <div className="border-t border-gray-200 px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Email Card */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-blue-100 rounded-lg p-3">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                                </div>
                            </div>

                            {/* Role Card */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-green-100 rounded-lg p-3">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                                </div>
                            </div>

                            {/* ID Card */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <Key className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.id}>
                                        {user?.id}
                                    </p>
                                </div>
                            </div>

                            {/* Admin ID Card */}
                            { user?.role === UserRole.admin && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-amber-100 rounded-lg p-3">
                                    <KeyRound className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Admin ID</h3>
                                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.admin?.id}>
                                        {user?.admin?.id}
                                    </p>
                                </div>
                            </div>}

                            {/* faculty ID Card */}
                            {user?.role === UserRole.faculty && 
                            <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-amber-100 rounded-lg p-3">
                                    <KeyRound className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Faculty ID</h3>
                                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.faculty?.id}>
                                        {user?.faculty?.id}
                                    </p>
                                </div>
                            </div>
                            }

                            {/* student ID Card */}
                            {user?.role === UserRole.student && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-amber-100 rounded-lg p-3">
                                    <KeyRound className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.student?.id}>
                                        {user?.student?.id}
                                    </p>
                                </div>
                            </div>}

                            {user?.role === UserRole.student && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-indigo-100 rounded-lg p-3">
                                    <IdCard className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Roll Number</h3>
                                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.student?.rollNumber}>
                                        {user?.student?.rollNumber}
                                    </p>
                                </div>
                            </div>}

                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 rounded-lg p-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                            </div>
                        </button>
                        {user?.role === 'admin' && (
                            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-lg p-2">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Admin Settings</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;