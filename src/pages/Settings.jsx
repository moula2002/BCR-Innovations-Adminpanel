import { useState } from 'react';
import { Camera, Save, User } from 'lucide-react';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // form submission logic
    console.log('Saved:', { email, newPassword, confirmPassword, profileImage });
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
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                placeholder="admin@bcr.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-bcr-blue/20 focus:border-bcr-blue transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 px-8 py-3 bg-bcr-blue text-white rounded-xl font-semibold hover:bg-bcr-blue/90 shadow-lg shadow-bcr-blue/20 transition-all active:scale-95"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
