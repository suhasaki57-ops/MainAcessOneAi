import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit3, FiKey } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">User Account Profile</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your identity, active session, and security credentials.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile/edit">
              <Button variant="secondary" className="flex items-center gap-2">
                <FiEdit3 /> Edit Profile
              </Button>
            </Link>
            <Link to="/profile/change-password">
              <Button variant="outline" className="flex items-center gap-2">
                <FiKey /> Change Password
              </Button>
            </Link>
          </div>
        </div>

        <Card className="flex flex-col md:flex-row items-center gap-6 p-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl shadow-cyan-500/20 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.full_name || user?.email || 'U').charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{user?.full_name || 'User'}</h2>
              <Badge variant="info" className="capitalize">
                <FiShield className="mr-1" /> {user?.role || 'user'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 mt-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                <FiMail className="text-cyan-400" />
                <span className="font-medium text-slate-200">{user?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                <FiCalendar className="text-cyan-400" />
                <span>Joined {formatDate(user?.created_at || new Date())}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
