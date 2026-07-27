import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getImageUrl } from '../utils';

const Subcategories = ({ token }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [subRes, catRes] = await Promise.all([
        api.get('/subcategories'),
        api.get('/categories')
      ]);
      setSubcategories(subRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/subcategories/${encodeURIComponent(id)}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete subcategory');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Subcategories</h1>
        <Link to="/subcategories/new" className="px-6 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-bcr-blue-dark transition-colors shadow-md shadow-bcr-blue/20 shrink-0">
          <Plus className="w-5 h-5" /> Add New Subcategory
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Image</th>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Parent Category</th>
              <th className="p-4 font-semibold text-gray-600">Product Count</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4">
                  {sub.image ? <img src={getImageUrl(sub.image)} alt={sub.name} className="h-10 w-10 object-cover rounded-md" /> : <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">No img</div>}
                </td>
                <td className="p-4 text-gray-900 font-medium">{sub.id}</td>
                <td className="p-4 text-gray-600">{sub.name}</td>
                <td className="p-4 text-gray-600">{categories.find(c => c.id === sub.parentCategory)?.name || sub.parentCategory}</td>
                <td className="p-4 text-gray-600">{sub.count}</td>
                <td className="p-4 text-right flex justify-end gap-2 min-w-[100px]">
                  <Link to={`/subcategories/edit/${sub.id}`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex">
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDelete(sub.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {subcategories.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No subcategories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subcategories;
