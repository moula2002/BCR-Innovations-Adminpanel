import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { getImageUrl } from '../utils';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      setError('Failed to load data');
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
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete product');
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <Link to="/products/new" className="px-6 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-bcr-blue-dark transition-colors shadow-md shadow-bcr-blue/20 shrink-0">
          <Plus className="w-5 h-5" /> Add New Product
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-48 object-cover bg-gray-100" />
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <div className="flex gap-1">
                  <Link to={`/products/edit/${product._id}`} className="text-blue-500 p-1 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2 mt-auto">{categories.find(c => c.id === product.category)?.name}</p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="md:col-span-3 p-8 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
