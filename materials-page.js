'use client'

import { useState } from 'react'
import { Plus, Search, Upload, Download, Edit, Trash2, AlertTriangle } from 'lucide-react'

export default function MaterialsPage() {
  // Sample data with "Not Applicable" GST
  const [materials, setMaterials] = useState([
    {
      id: '1',
      sku: 'MAT-000001',
      name: 'Banarasi Silk',
      description: 'Premium quality silk fabric from Varanasi',
      unit: 'Meter',
      supplier: 'Silk House Varanasi',
      costPerUnit: 450,
      hsnCode: '50071000',
      gstRate: 'Not Applicable',
      currentStock: 50,
      minStock: 10,
      status: 'Active',
      imageUrl: null
    },
    {
      id: '2',
      sku: 'MAT-000002',
      name: 'Cotton Linen',
      description: 'Breathable summer fabric',
      unit: 'Meter',
      supplier: 'Fabric World Mumbai',
      costPerUnit: 120,
      hsnCode: '52081100',
      gstRate: 'Not Applicable',
      currentStock: 8,
      minStock: 20,
      status: 'Active',
      imageUrl: null
    },
    {
      id: '3',
      sku: 'MAT-000003',
      name: 'Gold Zari Thread',
      description: '24K gold plated thread for embroidery',
      unit: 'Spool',
      supplier: 'Thread Mart Delhi',
      costPerUnit: 25,
      hsnCode: '55081000',
      gstRate: 'Not Applicable',
      currentStock: 200,
      minStock: 50,
      status: 'Active',
      imageUrl: null
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterSupplier, setFilterSupplier] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)

  // Form state with "Not Applicable" as default
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'Meter',
    supplier: '',
    costPerUnit: '',
    hsnCode: '',
    gstRate: 'Not Applicable',
    currentStock: '',
    minStock: '',
    status: 'Active'
  })

  const suppliers = ['All', ...new Set(materials.map(m => m.supplier))]

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || material.status === filterStatus
    const matchesSupplier = filterSupplier === 'All' || material.supplier === filterSupplier
    return matchesSearch && matchesStatus && matchesSupplier
  })

  const generateSKU = () => {
    const maxId = materials.reduce((max, m) => {
      const num = parseInt(m.sku.split('-')[1])
      return num > max ? num : max
    }, 0)
    return `MAT-${String(maxId + 1).padStart(6, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id 
          ? { ...editingMaterial, ...formData }
          : m
      ))
    } else {
      const newMaterial = {
        id: Date.now().toString(),
        sku: generateSKU(),
        ...formData,
        costPerUnit: parseFloat(formData.costPerUnit),
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        imageUrl: null
      }
      setMaterials([...materials, newMaterial])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unit: 'Meter',
      supplier: '',
      costPerUnit: '',
      hsnCode: '',
      gstRate: 'Not Applicable',
      currentStock: '',
      minStock: '',
      status: 'Active'
    })
    setShowAddModal(false)
    setEditingMaterial(null)
  }

  const handleEdit = (material) => {
    setEditingMaterial(material)
    setFormData({
      name: material.name,
      description: material.description,
      unit: material.unit,
      supplier: material.supplier,
      costPerUnit: material.costPerUnit.toString(),
      hsnCode: material.hsnCode,
      gstRate: material.gstRate.toString(),
      currentStock: material.currentStock.toString(),
      minStock: material.minStock.toString(),
      status: material.status
    })
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id))
    }
  }

  const handleExport = () => {
    const csvData = filteredMaterials.map(m => ({
      SKU: m.sku,
      Name: m.name,
      Description: m.description,
      Unit: m.unit,
      Supplier: m.supplier,
      'Cost Per Unit': m.costPerUnit,
      'HSN Code': m.hsnCode,
      'GST Rate': m.gstRate,
      'Current Stock': m.currentStock,
      'Min Stock': m.minStock,
      Status: m.status
    }))
    
    const headers = Object.keys(csvData[0]).join(',')
    const rows = csvData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `materials_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleDownloadTemplate = () => {
    const template = `Name,Description,Unit,Supplier,Cost Per Unit,HSN Code,GST Rate,Current Stock,Min Stock,Status
Banarasi Silk,Premium silk fabric,Meter,Silk House,450,50071000,Not Applicable,50,10,Active
Cotton Linen,Summer fabric,Meter,Fabric World,120,52081100,Not Applicable,100,20,Active`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'materials_template.csv'
    a.click()
  }

  const handleImportCSV = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        alert(`CSV file "${file.name}" ready for import. Full import functionality will be added with database integration.`)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materials Management</h1>
          <p className="text-gray-500 mt-1">Track and manage raw materials inventory</p>
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
            onClick={handleImportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import CSV
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
            Add Material
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
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
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {suppliers.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Materials</p>
          <p className="text-2xl font-bold">{materials.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active Materials</p>
          <p className="text-2xl font-bold text-green-600">
            {materials.filter(m => m.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-orange-600">
            {materials.filter(m => m.currentStock < m.minStock).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{materials.reduce((sum, m) => sum + (m.costPerUnit * m.currentStock), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.sku}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {material.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        material.currentStock < material.minStock 
                          ? 'text-orange-600' 
                          : 'text-gray-900'
                      }`}>
                        {material.currentStock} {material.unit}
                      </span>
                      {material.currentStock < material.minStock && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Min: {material.minStock}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{material.costPerUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {material.gstRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      material.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
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
                {editingMaterial ? 'Edit Material' : 'Add New Material'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Name *
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
                      Unit of Measurement *
                    </label>
                    <select
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Meter">Meter</option>
                      <option value="Piece">Piece</option>
                      <option value="Kg">Kilogram</option>
                      <option value="Gram">Gram</option>
                      <option value="Spool">Spool</option>
                      <option value="Yard">Yard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
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
                      HSN Code *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6,8}"
                      value={formData.hsnCode}
                      onChange={(e) => setFormData({...formData, hsnCode: e.target.value})}
                      placeholder="6-8 digits"
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
                      <option value="Not Applicable">Not Applicable</option>
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.currentStock}
                      onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock Level *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: e.target.value})}
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
                    {editingMaterial ? 'Update' : 'Add'} Material
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
