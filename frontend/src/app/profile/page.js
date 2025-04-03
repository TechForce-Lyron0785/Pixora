"use client";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute, WithLoading } from "@/components/hoc";
import { useState } from "react";
import { User, Mail, Calendar, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  // console.log(user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <WithLoading>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-600 to-indigo-600">
              <h3 className="text-lg leading-6 font-medium text-white">User Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-purple-100">Personal details and information</p>
            </div>
            <div className="border-t border-gray-700">
              <dl>
                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-400 flex items-center">
                    <User className="mr-2 h-5 w-5 text-purple-400" />
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user?.fullName || "Not available"}
                  </dd>
                </div>
                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-400 flex items-center">
                    <User className="mr-2 h-5 w-5 text-purple-400" />
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user?.username || "Not available"}
                  </dd>
                </div>
                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-400 flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-purple-400" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user?.email || "Not available"}
                  </dd>
                </div>
                <div className="bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-400 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-purple-400" />
                    Joined
                  </dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6 flex justify-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isLoggingOut ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </WithLoading>
  );
};

export default ProfilePage;