import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils';

const ProductForm = ({ token }) => {
  const params = useParams();
  const id = params['*'];
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    subcategory: '',
    brands: '',
    sku: '',
    features: '',
    specifications: '',
    material: '',
    size: '',
    capacity: '',
    warranty: '',
    applications: '',
    tabs: []
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          api.get('/categories'),
          api.get('/subcategories')
        ]);
        setCategories(catRes.data.data);
        setAllSubcategories(subRes.data.data);

        if (isEditing) {
          const prodRes = await api.get(`/products/${id}`);
          const product = prodRes.data.data;
          
          if (product) {
              setFormData({
                name: product.name || '',
                description: product.description || '',
                image: product.image || '',
                category: product.category || '',
                subcategory: product.subcategory || '',
              brands: product.brands || '',
              sku: product.sku || '',
              features: Array.isArray(product.features) ? product.features.join(', ') : product.features || '',
              specifications: product.specifications || '',
              material: product.material || '',
              size: product.size || '',
              capacity: product.capacity || '',
              warranty: product.warranty || '',
              applications: product.applications || '',
              tabs: product.tabs || []
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
      setFormData({ ...formData, image: data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddTab = () => {
    setFormData({
      ...formData,
      tabs: [...formData.tabs, { name: 'New Section', title: '', description: '', image: '', features: [] }]
    });
  };

  const handleUpdateTab = (tabIndex, field, value) => {
    const updatedTabs = [...formData.tabs];
    updatedTabs[tabIndex][field] = value;
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const handleRemoveTab = (tabIndex) => {
    const updatedTabs = [...formData.tabs];
    updatedTabs.splice(tabIndex, 1);
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const handleAddFeature = (tabIndex) => {
    const updatedTabs = [...formData.tabs];
    updatedTabs[tabIndex].features.push({ heading: '', description: '', icon: '' });
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const handleUpdateFeature = (tabIndex, featureIndex, field, value) => {
    const updatedTabs = [...formData.tabs];
    updatedTabs[tabIndex].features[featureIndex][field] = value;
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const handleRemoveFeature = (tabIndex, featureIndex) => {
    const updatedTabs = [...formData.tabs];
    updatedTabs[tabIndex].features.splice(featureIndex, 1);
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const handleTabImageChange = async (e, tabIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageFormData = new FormData();
    imageFormData.append('image', file);
    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload', imageFormData);
      handleUpdateTab(tabIndex, 'image', data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload tab image');
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
      console.error("Product creation error details:", err.response?.data);
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
                  {formData.image ? <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 opacity-50" />}
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
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Subcategory</label>
              <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-bcr-blue focus:bg-white outline-none transition-all">
                <option value="">No Subcategory</option>
                {allSubcategories.filter(sub => sub.parentCategory === formData.category).map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
              </select>
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

            {/* Rich Content Tabs Section */}
            <div className="md:col-span-2 mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Rich Content Sections <span className="text-sm font-normal text-gray-400 ml-2">(Optional)</span></h2>
                  <p className="text-sm text-gray-500">Add detailed sections (like Overview, Design, Material) with images and bullet points.</p>
                </div>
                <button type="button" onClick={handleAddTab} className="px-4 py-2 bg-bcr-blue/10 text-bcr-blue font-semibold rounded-xl flex items-center gap-2 hover:bg-bcr-blue hover:text-white transition-all">
                  <Plus className="w-4 h-4" /> Add Section
                </button>
              </div>

              <div className="space-y-6">
                {formData.tabs.map((tab, tIdx) => (
                  <div key={tIdx} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                      <input 
                        type="text" value={tab.name} onChange={(e) => handleUpdateTab(tIdx, 'name', e.target.value)}
                        placeholder="Section Name (e.g. Design)"
                        className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-bcr-blue placeholder:text-gray-300 w-64"
                      />
                      <button type="button" onClick={() => handleRemoveTab(tIdx)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Section Title</label>
                        <input type="text" value={tab.title} onChange={(e) => handleUpdateTab(tIdx, 'title', e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-bcr-blue outline-none" placeholder="e.g. Continuous Display Mastery" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                        <textarea value={tab.description} onChange={(e) => handleUpdateTab(tIdx, 'description', e.target.value)} rows="2" className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-bcr-blue outline-none resize-none" placeholder="Section description..." />
                      </div>
                      <div className="md:col-span-2">
                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Section Image</label>
                         <div className="flex items-center gap-4">
                           {tab.image && <img src={getImageUrl(tab.image)} alt="Tab" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />}
                           <input type="file" accept="image/*" onChange={(e) => handleTabImageChange(e, tIdx)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-bcr-blue hover:file:bg-blue-100 cursor-pointer" />
                         </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-700">Features / Bullet Points</h4>
                        <button type="button" onClick={() => handleAddFeature(tIdx)} className="text-xs font-semibold text-bcr-blue hover:text-bcr-blue-dark flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-3">
                        {tab.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <input type="text" value={feat.heading} onChange={(e) => handleUpdateFeature(tIdx, fIdx, 'heading', e.target.value)} placeholder="Heading (e.g. Glass structure)" className="flex-1 px-2 py-1.5 text-sm bg-gray-50 rounded border border-gray-200 focus:border-bcr-blue outline-none" />
                                <input type="text" value={feat.icon} onChange={(e) => handleUpdateFeature(tIdx, fIdx, 'icon', e.target.value)} placeholder="Icon (e.g. Layers)" className="w-32 px-2 py-1.5 text-sm bg-gray-50 rounded border border-gray-200 focus:border-bcr-blue outline-none" />
                              </div>
                              <textarea value={feat.description} onChange={(e) => handleUpdateFeature(tIdx, fIdx, 'description', e.target.value)} rows="2" placeholder="Feature description..." className="w-full px-2 py-1.5 text-sm bg-gray-50 rounded border border-gray-200 focus:border-bcr-blue outline-none resize-none" />
                            </div>
                            <button type="button" onClick={() => handleRemoveFeature(tIdx, fIdx)} className="mt-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {tab.features.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No features added to this section.</p>}
                      </div>
                    </div>
                  </div>
                ))}
                {formData.tabs.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">No rich content sections yet.</p>
                    <button type="button" onClick={handleAddTab} className="text-sm font-semibold text-bcr-blue hover:underline">Add your first section (e.g. Overview)</button>
                  </div>
                )}
              </div>
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
