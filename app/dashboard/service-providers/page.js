'use client'

import { useState } from 'react'
import { Plus, Search, Download, Edit, Trash2, Phone, Mail } from 'lucide-react'

export default function ServiceProvidersPage() {
  const [providers, setProviders] = useState([
    {
      id: '1',
      name: 'Tailor - Ramesh Kumar',
      contact: '9876543210',
      email: 'ramesh@email.com',
      address: 'Shop 15, Gandhi Market',
      specialization: 'Stitching & Alterations',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Embroidery Studio',
      contact: '9876543211',
      email: 'embroidery@studio.com',
      address: '23, Textile Lane',
      specialization: 'Hand & Machine Embroidery',
      status: 'Active'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    specialization: '',
    status: 'Active'
  })

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.contact.includes(searchTerm)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProvider) {
      setProviders(providers.map(p => 
        p.id === editingProvider.id ? { ...editingProvider, ...formData } : p
      ))
    } else {
      const newProvider = {
        id: Date.now().toString(),
        ...formData
      }
      setProviders([...providers, newProvider])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
      specialization: '',
      status: 'Active'
    })
    setShowAddModal(false)
    setEditingProvider(null)
  }

  const handleEdit = (provider) => {
    setEditingProvider(provider)
    setFormData(provider)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service provider?')) {
      setProviders(providers.filter(p => p.id !== id))
    }
  }

  const handleExport = () => {
    const csvData = filteredProviders.map(p => ({
      Name: p.name,
      Contact: p.contact,
      Email: p.email || '',
      Address: p.address || '',
      Specialization: p.specialization || '',
      Status: p.status
    }))
    
    const headers = Object.keys(csvData[0]).join(',')
    const rows = csvData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `service_providers_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Providers</h1>
          <p className="text-gray-500 mt-1">Manage tailors, embroidery studios, and other service providers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Providers</p>
          <p className="text-2xl font-bold">{providers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active Providers</p>
          <p className="text-2xl font-bold text-green-600">
            {providers.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Specializations</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Set(providers.map(p => p.specialization)).size}
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                provider.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {provider.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {provider.contact}
              </div>
              {provider.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {provider.email}
                </div>
              )}
              {provider.address && (
                <p className="text-sm text-gray-600">{provider.address}</p>
              )}
              {provider.specialization && (
                <p className="text-sm text-blue-600 font-medium">{provider.specialization}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(provider)}
                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(provider.id)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingProvider ? 'Edit Service Provider' : 'Add New Service Provider'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      placeholder="10 digits"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="e.g., Stitching & Alterations"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                  >
                    {editingProvider ? 'Update' : 'Add'} Provider
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
