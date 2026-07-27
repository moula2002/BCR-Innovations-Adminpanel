import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const ProductForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    price: '',
    brands: '',
    sku: '',
    features: '',
    specifications: '',
    material: '',
    size: '',
    capacity: '',
    warranty: '',
    applications: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data.data);

        if (isEditing) {
          const prodRes = await api.get(`/products/${id}`);
          const product = prodRes.data.data;
          
          if (product) {
              setFormData({
                name: product.name || '',
                description: product.description || '',
                image: product.image || '',
                category: product.category || '',
              price: product.price || '',
              brands: product.brands || '',
              sku: product.sku || '',
              features: Array.isArray(product.features) ? product.features.join(', ') : product.features || '',
              specifications: product.specifications || '',
              material: product.material || '',
              size: product.size || '',
              capacity: product.capacity || '',
              warranty: product.warranty || '',
              applications: product.applications || ''
            });
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    
    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload', imageFormData);
      setFormData({ ...formData, image: `https://bcr-innovations-server-1.onrender.com${data}` });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/products" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-bcr-blue hover:border-bcr-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Product Image</label>
              <div className="flex items-start gap-6 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="w-32 h-32 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 overflow-hidden shrink-0">
                  {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 opacity-50" />}
                </div>
                <div className="flex-1 mt-2">
                  <input 
                    type="file" accept="image/*" onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bcr-blue-light file:text-bcr-blue hover:file:bg-bcr-blue hover:file:text-white transition-all cursor-pointer"
                  />
                  {uploadingImage && <div className="text-sm text-bcr-blue mt-2 font-medium flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-bcr-blue border-t-transparent animate-spin"></div> Uploading...</div>}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Product Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required>
                <option value="" disabled>Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Price <span className="text-gray-400 font-normal">(e.g., "₹999" or "Contact")</span></label>
              <input name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Brands</label>
              <input name="brands" value={formData.brands} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">SKU / Product Code</label>
              <input name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Material</label>
              <input name="material" value={formData.material} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Size / Dimensions</label>
              <input name="size" value={formData.size} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Capacity</label>
              <input name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Warranty Details</label>
              <input name="warranty" value={formData.warranty} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Applications</label>
              <input name="applications" value={formData.applications} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Features <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <textarea name="features" value={formData.features} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Technical Specifications</label>
              <textarea name="specifications" value={formData.specifications} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none" required></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <Link to="/products" className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={uploadingImage} className="px-8 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center gap-2 hover:bg-bcr-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-bcr-blue/20">
              <Save className="w-5 h-5" /> 
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
