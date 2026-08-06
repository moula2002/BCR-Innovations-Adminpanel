import { useState, useEffect } from 'react';
import { Camera, Save, User, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUsername(res.data.data.username || '');
          setProfileImage(res.data.data.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality to keep payload small
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProfileImage(dataUrl);
        };
        img.src = event.target.result;
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { username };
      if (newPassword) payload.newPassword = newPassword;
      if (profileImage) {
        payload.profileImage = profileImage;
      }
      
      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        window.dispatchEvent(new Event('profileUpdated'));
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: res.data.error || 'Failed to update profile.' });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Error updating profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-bcr-blue-light rounded-xl text-bcr-blue">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Profile Settings</h2>
          <p className="text-slate-500 mt-1">Manage your admin account details, email, and password.</p>
        </div>
      </div>
      
      <div className="bg-admin-panel border border-admin-border rounded-3xl p-6 md:p-8 shadow-sm">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <RefreshCw className="w-8 h-8 text-bcr-blue animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-slate-300 font-bold">A</span>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-bcr-blue text-white p-2 rounded-full cursor-pointer hover:bg-bcr-blue/90 transition-colors shadow-lg">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-slate-800">Profile Photo</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Upload a new avatar. Large images will be resized automatically.</p>
            </div>
          </div>

          <hr className="border-admin-border" />

          {/* Form Fields Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-bcr-blue text-white rounded-xl font-semibold hover:bg-bcr-blue/90 shadow-lg shadow-bcr-blue/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
