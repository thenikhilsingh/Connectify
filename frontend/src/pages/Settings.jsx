import { useContext, useState } from "react";
import { Lock, Bell, Shield, LogOut, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>

          <p className="text-gray-500 mt-2">
            Manage your account security and preferences.
          </p>
        </div>
        {/* Change Password */}

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Lock className="text-violet-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Change Password</h2>

              <p className="text-gray-500 text-sm">
                Keep your account secure by updating your password.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                />

                {/* <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 -bottom-1 text-gray-500 hover:text-violet-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button> */}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <button
              disabled={user?.isGuest}
              className={
                user?.isGuest
                  ? "cursor-not-allowed mt-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium transition"
                  : "mt-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium transition"
              }
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Logout */}

        <div className="bg-white border border-red-200 rounded-3xl shadow-sm p-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <LogOut className="text-red-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold">Logout</h2>

                <p className="text-gray-500 mt-1">
                  You'll need to sign in again to access your account.
                </p>
              </div>
            </div>

            <button className="bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-xl font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
