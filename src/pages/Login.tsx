import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";
import { Lock, LogIn, School } from 'lucide-react';

const Login: React.FC = () => {
    const { googleLogin, isAuthenticated, isLoading } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex flex-col items-center h-full w-full bg-gray-50">
            {/* Header */}
            <header className="mt-5 w-4/5 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to Capstone</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access the project management portal
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Login Card */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 rounded-full p-4 mb-6">
                                <Lock className="h-8 w-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-600 text-center mb-8">
                                Access your projects, collaborations, and resources
                            </p>

                            <button
                                onClick={googleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
                            >
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Continue with Google
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* Features Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 rounded-lg p-3">
                                    <School className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                                    Platform Features
                                </h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <LogIn className="h-5 w-5 mr-3 text-blue-500" />
                                    Secure authentication with your institutional account
                                </li>
                                <li className="flex items-center">
                                    <LogIn className="h-5 w-5 mr-3 text-blue-500" />
                                    Access to all project management tools
                                </li>
                                <li className="flex items-center">
                                    <LogIn className="h-5 w-5 mr-3 text-blue-500" />
                                    Collaboration with faculty and students
                                </li>
                                <li className="flex items-center">
                                    <LogIn className="h-5 w-5 mr-3 text-blue-500" />
                                    Real-time project updates and notifications
                                </li>
                            </ul>
                        </div>

                        {/* Logo */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
                            <img
                                src="/Logo-2.png"
                                alt="CapStone Logo"
                                className="max-w-[200px] h-auto"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;