import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import InputField from '../components/forms/InputField';
import PasswordStrengthMeter from '../components/ui/PasswordStrengthMeter';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit3, FiKey, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { addToast } = useNotification();

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateProfile({ fullName, avatarUrl });
      addToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await changePassword({ oldPassword, newPassword, confirmNewPassword });
      addToast({ message: 'Password updated successfully!', type: 'success' });
      setIsPasswordOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      addToast({ message: 'Account deleted successfully.', type: 'info' });
    } catch (err) {
      addToast({ message: err.message || 'Failed to delete account.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Account & Security Profile</h1>
            <p className="text-sm text-slate-400 mt-1">Manage user identity, active credentials, and profile options.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(true)} className="flex items-center gap-1.5 text-xs">
              <FiEdit3 /> Edit Profile
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordOpen(true)} className="flex items-center gap-1.5 text-xs">
              <FiKey /> Change Password
            </Button>
          </div>
        </div>

        {/* Overview Profile Card */}
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
              <h2 className="text-2xl font-bold text-white">{user?.full_name || 'Engineer User'}</h2>
              <Badge variant="info" className="capitalize">
                <FiShield className="mr-1" /> {user?.role || 'user'}
              </Badge>
              <Badge variant="success">Active Account</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 mt-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                <FiMail className="text-cyan-400" />
                <span className="font-semibold text-slate-200">{user?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                <FiCalendar className="text-cyan-400" />
                <span>Joined {formatDate(user?.created_at || new Date())}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border border-red-500/20 bg-red-500/5 flex flex-col gap-3">
          <h3 className="font-bold text-red-400 text-sm">Danger Zone</h3>
          <p className="text-xs text-slate-400">
            Permanently remove your account and all saved accessibility reports from Supabase.
          </p>
          <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)} className="w-fit flex items-center gap-2">
            <FiTrash2 /> Delete My Account
          </Button>
        </Card>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile Details">
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}
            <InputField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <InputField label="Avatar Image URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Modal>

        {/* Change Password Modal */}
        <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Update Account Password">
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}
            <InputField label="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            <div className="flex flex-col gap-1">
              <InputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <PasswordStrengthMeter password={newPassword} />
            </div>
            <InputField label="Confirm New Password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Modal>

        {/* Delete Account Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Account Deletion">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-300">
              Are you sure you want to delete your account? This action is irreversible and all your data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="danger" disabled={loading} onClick={handleDeleteSubmit}>
                {loading ? 'Deleting...' : 'Yes, Delete Account'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
