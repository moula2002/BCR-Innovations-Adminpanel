import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const CareerForm = ({ token }) => {
  const params = useParams();
  const id = params['*'];
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const res = await api.get('/careers');
          const job = res.data.data.find(c => c._id === id);
          if (job) {
            setFormData({
              title: job.title,
              department: job.department,
              location: job.location,
              type: job.type,
              description: job.description
            });
          } else {
            setError('Job not found');
          }
        } catch (err) {
          setError('Failed to load job details');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/careers/${id}`, formData);
      } else {
        await api.post('/careers', formData);
      }
      navigate('/careers');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} job`);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/careers" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-bcr-blue hover:border-bcr-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Job Posting' : 'Add New Job'}</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Department</label>
              <input 
                type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required
                placeholder="e.g. Sales, Engineering"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Location</label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required
                placeholder="e.g. Remote, Berlin, Germany"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Type</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Description / Requirements</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="6"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <Link to="/careers" className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-8 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center gap-2 hover:bg-bcr-blue-dark transition-all shadow-md shadow-bcr-blue/20">
              <Save className="w-5 h-5" /> 
              {isEditing ? 'Save Changes' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
