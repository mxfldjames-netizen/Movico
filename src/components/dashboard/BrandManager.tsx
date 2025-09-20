import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit, Save, X, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  guidelines: string | null;
  industry: string | null;
  target_audience: string | null;
  brand_colors: string[] | null;
}

interface BrandAsset {
  id: string;
  brand_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

interface AdIdea {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  target_audience: string | null;
  campaign_type: string | null;
  status: string;
}

const BrandManager: React.FC = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [adIdeas, setAdIdeas] = useState<AdIdea[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    guidelines: '',
    industry: '',
    target_audience: '',
    brand_colors: [''],
  });

  const [newAdIdea, setNewAdIdea] = useState({
    title: '',
    description: '',
    target_audience: '',
    campaign_type: '',
  });

  useEffect(() => {
    if (user) {
      fetchBrands();
    }
  }, [user]);

  useEffect(() => {
    if (selectedBrand) {
      fetchBrandAssets(selectedBrand.id);
      fetchAdIdeas(selectedBrand.id);
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandAssets = async (brandId: string) => {
    try {
      const { data, error } = await supabase
        .from('brand_assets')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrandAssets(data || []);
    } catch (error) {
      console.error('Error fetching brand assets:', error);
    }
  };

  const fetchAdIdeas = async (brandId: string) => {
    try {
      const { data, error } = await supabase
        .from('ad_ideas')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ad ideas:', error);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description || null,
          guidelines: formData.guidelines || null,
          industry: formData.industry || null,
          target_audience: formData.target_audience || null,
          brand_colors: formData.brand_colors.filter(color => color.trim() !== ''),
        })
        .select()
        .single();

      if (error) throw error;

      setBrands([data, ...brands]);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    try {
      const { data, error } = await supabase
        .from('brands')
        .update({
          name: formData.name,
          description: formData.description || null,
          guidelines: formData.guidelines || null,
          industry: formData.industry || null,
          target_audience: formData.target_audience || null,
          brand_colors: formData.brand_colors.filter(color => color.trim() !== ''),
        })
        .eq('id', editingBrand.id)
        .select()
        .single();

      if (error) throw error;

      setBrands(brands.map(b => b.id === editingBrand.id ? data : b));
      if (selectedBrand?.id === editingBrand.id) {
        setSelectedBrand(data);
      }
      setEditingBrand(null);
      resetForm();
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId);

      if (error) throw error;

      setBrands(brands.filter(b => b.id !== brandId));
      if (selectedBrand?.id === brandId) {
        setSelectedBrand(null);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedBrand) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `brand-assets/${selectedBrand.id}/${fileName}`;

    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      // Save to database
      const { data, error } = await supabase
        .from('brand_assets')
        .insert({
          brand_id: selectedBrand.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (error) throw error;

      setBrandAssets([data, ...brandAssets]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddAdIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    try {
      const { data, error } = await supabase
        .from('ad_ideas')
        .insert({
          brand_id: selectedBrand.id,
          title: newAdIdea.title,
          description: newAdIdea.description,
          target_audience: newAdIdea.target_audience || null,
          campaign_type: newAdIdea.campaign_type || null,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      setAdIdeas([data, ...adIdeas]);
      setNewAdIdea({ title: '', description: '', target_audience: '', campaign_type: '' });
    } catch (error) {
      console.error('Error adding ad idea:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      guidelines: '',
      industry: '',
      target_audience: '',
      brand_colors: [''],
    });
  };

  const startEditing = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      guidelines: brand.guidelines || '',
      industry: brand.industry || '',
      target_audience: brand.target_audience || '',
      brand_colors: brand.brand_colors || [''],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Brand Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Brand
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Your Brands</h2>
            </div>
            <div className="p-4 space-y-3">
              {brands.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No brands created yet</p>
              ) : (
                brands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      selectedBrand?.id === brand.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{brand.name}</h3>
                        {brand.industry && (
                          <p className="text-sm text-gray-500">{brand.industry}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(brand);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBrand(brand.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Brand Details */}
        <div className="lg:col-span-2">
          {selectedBrand ? (
            <div className="space-y-6">
              {/* Brand Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{selectedBrand.name}</h2>
                {selectedBrand.description && (
                  <p className="text-gray-600 mb-4">{selectedBrand.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBrand.industry && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <p className="text-gray-900">{selectedBrand.industry}</p>
                    </div>
                  )}
                  {selectedBrand.target_audience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                      <p className="text-gray-900">{selectedBrand.target_audience}</p>
                    </div>
                  )}
                </div>
                {selectedBrand.guidelines && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Guidelines</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedBrand.guidelines}</p>
                  </div>
                )}
              </div>

              {/* Brand Assets */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Brand Assets</h3>
                  <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Asset
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {brandAssets.map((asset) => (
                    <div key={asset.id} className="border border-gray-200 rounded-lg p-3">
                      {asset.file_type.startsWith('image/') ? (
                        <img
                          src={asset.file_url}
                          alt={asset.file_name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm text-gray-900 truncate">{asset.file_name}</p>
                      <p className="text-xs text-gray-500">{(asset.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad Ideas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Ideas</h3>
                
                {/* Add New Ad Idea Form */}
                <form onSubmit={handleAddAdIdea} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Ad Title"
                      value={newAdIdea.title}
                      onChange={(e) => setNewAdIdea({ ...newAdIdea, title: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    <select
                      value={newAdIdea.campaign_type}
                      onChange={(e) => setNewAdIdea({ ...newAdIdea, campaign_type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Campaign Type</option>
                      <option value="video">Video Ad</option>
                      <option value="static">Static Ad</option>
                      <option value="carousel">Carousel Ad</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Describe your ad idea..."
                    value={newAdIdea.description}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                    rows={3}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Target Audience (optional)"
                    value={newAdIdea.target_audience}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, target_audience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Add Ad Idea
                  </button>
                </form>

                {/* Ad Ideas List */}
                <div className="space-y-3">
                  {adIdeas.map((idea) => (
                    <div key={idea.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{idea.title}</h4>
                          <p className="text-gray-600 mt-1">{idea.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            {idea.campaign_type && (
                              <span className="bg-gray-100 px-2 py-1 rounded">{idea.campaign_type}</span>
                            )}
                            {idea.target_audience && (
                              <span>Target: {idea.target_audience}</span>
                            )}
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{idea.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Brand</h3>
              <p className="text-gray-500">Choose a brand from the list to view and manage its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Brand Modal */}
      {(showCreateForm || editingBrand) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingBrand ? 'Edit Brand' : 'Create New Brand'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingBrand(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Guidelines</label>
                  <textarea
                    value={formData.guidelines}
                    onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                    placeholder="Describe your brand's voice, tone, style guidelines..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                  {formData.brand_colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...formData.brand_colors];
                          newColors[index] = e.target.value;
                          setFormData({ ...formData, brand_colors: newColors });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="#000000 or color name"
                      />
                      {formData.brand_colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = formData.brand_colors.filter((_, i) => i !== index);
                            setFormData({ ...formData, brand_colors: newColors });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, brand_colors: [...formData.brand_colors, ''] })}
                    className="text-sm text-black hover:underline"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {editingBrand ? 'Update Brand' : 'Create Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingBrand(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManager;