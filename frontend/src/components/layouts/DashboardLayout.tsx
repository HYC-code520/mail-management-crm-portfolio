import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import toast from 'react-hot-toast';

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/signin');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold text-brand">Mei Way Mail Plus</h1>
            </Link>

            {/* Language Toggle & User */}
            <div className="flex items-center gap-4">
              {/* User info & Sign Out */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-full p-1 w-fit mb-6">
            <Link
              to="/dashboard"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/intake"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                location.pathname === '/dashboard/intake'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Intake
            </Link>
            <Link
              to="/dashboard/contacts"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isActive('/dashboard/contacts')
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customers
            </Link>
            <Link
              to="/dashboard/templates"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                location.pathname === '/dashboard/templates'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Templates
            </Link>
            <Link
              to="/dashboard/log"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                location.pathname === '/dashboard/log'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Log
            </Link>
            <Link
              to="/dashboard/design-system"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                location.pathname === '/dashboard/design-system'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Design
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
