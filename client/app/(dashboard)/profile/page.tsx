"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          {user?.avatar ? (
             <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full shadow-sm object-cover border-2 border-white" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user?.name || "Loading..."}</h2>
            <p className="text-gray-500">{user?.email || ""}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              defaultValue={user?.name || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              defaultValue={user?.phone || ""}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
