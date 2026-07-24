import { useState, useEffect } from 'react';
import { Mail, Search, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/contacts');
      
      if (response.data.success) {
        setInquiries(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch inquiries');
      }
    } catch (err) {
      setError('Network error. Ensure the backend server is running and database is connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inquiries</h2>
          <p className="text-sm text-admin-muted mt-1">Manage and view customer contact messages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="pl-9 pr-4 py-2 border border-admin-border rounded-xl text-sm focus:outline-none focus:border-bcr-blue bg-white shadow-sm"
            />
          </div>
          <button 
            onClick={fetchInquiries}
            className="p-2 border border-admin-border rounded-xl hover:bg-slate-50 transition-colors shadow-sm bg-white text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">Error Loading Data</h4>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-admin-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-admin-border text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Subject & Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {isLoading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-bcr-blue" />
                      <span>Loading inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 && !error ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <Mail className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                    <p className="text-base font-medium">No inquiries found.</p>
                    <p className="text-xs mt-1">When customers contact you, messages will appear here.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                      <div className="text-xs mt-0.5">{new Date(inquiry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{inquiry.firstName} {inquiry.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-600 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-bcr-blue">{inquiry.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[300px]">
                      <div className="font-medium text-slate-800">{inquiry.subject || 'No Subject'}</div>
                      <div className="text-slate-500 mt-1 line-clamp-2" title={inquiry.message}>
                        {inquiry.message}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;
