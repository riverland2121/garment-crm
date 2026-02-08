'use client'

import { useState } from 'react'
import { Plus, Search, Download, Edit, Trash2, Clock } from 'lucide-react'

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: '1',
      sku: 'SVC-000001',
      name: 'Kurti Stitching',
      description: 'Basic stitching service for kurti/top',
      unit: 'Per Piece',
      provider: 'Tailor - Ramesh Kumar',
      costPerUnit: 150,
      hsnCode: '998321',
      gstRate: 18,
      estimatedTime: 2, // in hours
      status: 'Active'
    },
    {
      id: '2',
      sku: 'SVC-000002',
      name: 'Hand Embroidery',
      description: 'Traditional hand embroidery work',
      unit: 'Per Design',
      provider: 'Embroidery Studio',
      costPerUnit: 500,
      hsnCode: '998322',
      gstRate: 18,
      estimatedTime: 8,
      status: 'Active'
    },
    {
      id: '3',
      sku: 'SVC-000003',
      name: 'Machine Embroidery',
      description: 'Machine-based embroidery patterns',
      unit: 'Per Piece',
      provider: 'Embroidery Studio',
      costPerUnit: 300,
      hsnCode: '998322',
      gstRate: 18,
      estimatedTime: 1,
      status: 'Active'
    },
    {
      id: '4',
      sku: 'SVC-000004',
      name: 'Alterations',
      description: 'General alterations and fitting adjustments',
      unit: 'Per Hour',
      provider: 'Tailor - Ramesh Kumar',
      costPerUnit: 200,
      hsnCode: '998321',
      gstRate: 18,
      estimatedTime: 1,
      status: 'Active'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterProvider, setFilterProvider] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'Per Piece',
    provider: '',
    costPerUnit: '',
    hsnCode: '',
    gstRate: '18',
    estimatedTime: '',
    status: 'Active'
  })

  const providers = ['All', ...new Set(services.map(s => s.provider))]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || service.status === filterStatus
    const matchesProvider = filterProvider === 'All' || service.provider === filterProvider
    return matchesSearch && matchesStatus && matchesProvider
  })

  const generateSKU = () => {
    const maxId = services.reduce((max, s) => {
      const num = parseInt(s.sku.split('-')[1])
      return num > max ? num : max
    }, 0)
    return `SVC-${String(maxId + 1).padStart(6, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...editingService, ...formData }
          : s
      ))
    } else {
      const newService = {
        id: Date.now().toString(),
        sku: generateSKU(),
        ...formData,
        costPerUnit: parseFloat(formData.costPerUnit),
        gstRate: parseInt(formData.gstRate),
        estimatedTime: parseFloat(formData.estimatedTime)
      }
      setServices([...services, newService])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unit: 'Per Piece',
      provider: '',
      costPerUnit: '',
      hsnCode: '',
      gstRate: '18',
      estimatedTime: '',
      status: 'Active'
    })
    setShowAddModal(false)
    setEditingService(null)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      unit: service.unit,
      provider: service.provider,
      costPerUnit: service.costPerUnit.toString(),
      hsnCode: service.hsnCode,
      gstRate: service.gstRate.toString(),
      estimatedTime: service.estimatedTime.toString(),
      status: service.status
    })
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  const handleExport = () => {
    const csvData = filteredServices.map(s => ({
      SKU: s.sku,
      Name: s.name,
      Description: s.description,
      Unit: s.unit,
      Provider: s.provider,
      'Cost Per Unit': s.costPerUnit,
      'HSN/SAC Code': s.hsnCode,
      'GST Rate': s.gstRate,
      'Estimated Time (hrs)': s.estimatedTime,
      Status: s.status
    }))
    
    const headers = Object.keys(csvData[0]).join(',')
    const rows = csvData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `services_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleDownloadTemplate = () => {
    const template = `Name,Description,Unit,Provider,Cost Per Unit,HSN/SAC Code,GST Rate,Estimated Time (hrs),Status
Stitching Service,Basic garment stitching,Per Piece,Tailor Shop,150,998321,18,2,Active
Hand Embroidery,Traditional hand embroidery,Per Design,Embroidery Studio,500,998322,18,8,Active`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'services_template.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-500 mt-1">Manage tailoring and related services</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Template
          </button>
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
            Add Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {providers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Services</p>
          <p className="text-2xl font-bold">{services.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active Services</p>
          <p className="text-2xl font-bold text-green-600">
            {services.filter(s => s.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Service Providers</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Set(services.map(s => s.provider)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Avg Cost</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{Math.round(services.reduce((sum, s) => sum + s.costPerUnit, 0) / services.length)}
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.sku}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {service.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {service.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{service.costPerUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.estimatedTime}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {service.gstRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      service.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Per Piece">Per Piece</option>
                      <option value="Per Hour">Per Hour</option>
                      <option value="Per Design">Per Design</option>
                      <option value="Per Item">Per Item</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Provider *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.provider}
                      onChange={(e) => setFormData({...formData, provider: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Per Unit (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HSN/SAC Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hsnCode}
                      onChange={(e) => setFormData({...formData, hsnCode: e.target.value})}
                      placeholder="e.g., 998321"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Rate *
                    </label>
                    <select
                      required
                      value={formData.gstRate}
                      onChange={(e) => setFormData({...formData, gstRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time (hours) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
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
                    {editingService ? 'Update' : 'Add'} Service
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
