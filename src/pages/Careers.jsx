import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, Edit2, Briefcase, RefreshCw } from 'lucide-react';

const Careers = ({ token }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data.data);
    } catch (err) {
      setError('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/careers/${id}`);
      fetchCareers();
    } catch (err) {
      setError('Failed to delete career');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <RefreshCw className="w-10 h-10 text-bcr-blue animate-spin" />
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Job Postings</h1>
        <Link to="/careers/new" className="px-6 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-bcr-blue-dark transition-colors shadow-md shadow-bcr-blue/20 shrink-0">
          <Plus className="w-5 h-5" /> Add New Job
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Department</th>
              <th className="p-4 font-semibold text-gray-600">Location</th>
              <th className="p-4 font-semibold text-gray-600">Type</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((job) => (
              <tr key={job._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bcr-blue/10 text-bcr-blue flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900">{job.title}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{job.department}</td>
                <td className="p-4 text-gray-600">{job.location}</td>
                <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">{job.type}</span></td>
                <td className="p-4 text-right flex justify-end gap-2 min-w-[100px]">
                  <Link to={`/careers/edit/${job._id}`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex">
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {careers.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No jobs posted yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Careers;
