import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const CategoryForm = ({ token }) => {
  const params = useParams();
  const id = params['*'];
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        try {
          const res = await api.get('/categories');
          const cat = res.data.data.find(c => c.id === id);
          if (cat) {
            setNewId(cat.id);
            setNewName(cat.name || '');
            setDescription(cat.description || '');
            setImage(cat.image || '');
            setSeoTitle(cat.seoTitle || '');
            setSeoDescription(cat.seoDescription || '');
          } else {
            setError('Category not found');
          }
        } catch (err) {
          setError('Failed to load category details');
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEditing]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    
    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload', imageFormData);
      setImage(`https://bcr-innovations-server-1.onrender.com${data}`);
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
        await api.put(`/categories/${encodeURIComponent(newId)}`, {
          name: newName, description, image, seoTitle, seoDescription
        });
      } else {
        await api.post('/categories', { 
          id: newId, name: newName, description, image, seoTitle, seoDescription
        });
      }
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} category`);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading category details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/categories" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-bcr-blue hover:border-bcr-blue transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Category' : 'Add New Category'}</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Category ID <span className="text-gray-400 font-normal">(e.g., 'power-tools')</span></label>
              <input 
                type="text" value={newId} onChange={(e) => setNewId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed" required disabled={isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Display Name</label>
              <input 
                type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all" required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Category Image</label>
              <div className="flex items-start gap-6 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 overflow-hidden shrink-0">
                  {image ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 opacity-50" />}
                </div>
                <div className="flex-1">
                  <input 
                    type="file" accept="image/*" onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bcr-blue-light file:text-bcr-blue hover:file:bg-bcr-blue hover:file:text-white transition-all cursor-pointer"
                  />
                  {uploadingImage && <div className="text-sm text-bcr-blue mt-2 font-medium flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-bcr-blue border-t-transparent animate-spin"></div> Uploading...</div>}
                  <p className="text-xs text-gray-400 mt-2">Recommended size: 800x600px. Max size: 2MB.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">SEO Title</label>
              <input 
                type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">SEO Description</label>
              <textarea 
                value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows="2"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <Link to="/categories" className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={uploadingImage} className="px-8 py-2.5 bg-bcr-blue text-white font-bold rounded-xl flex items-center gap-2 hover:bg-bcr-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-bcr-blue/20">
              <Save className="w-5 h-5" /> 
              {isEditing ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
