'use client'

import { useState } from 'react'
import { Plus, Search, Download, Upload, Edit, Trash2, Copy, X } from 'lucide-react'

export default function ProductsPage() {
  // Available materials and services for BOM
  const availableMaterials = [
    { id: 'MAT-000001', name: 'Banarasi Silk', cost: 450, unit: 'Meter' },
    { id: 'MAT-000002', name: 'Cotton Linen', cost: 120, unit: 'Meter' },
    { id: 'MAT-000003', name: 'Gold Zari Thread', cost: 25, unit: 'Spool' }
  ]

  const availableServices = [
    { id: 'SVC-000001', name: 'Kurti Stitching', cost: 150, unit: 'Piece' },
    { id: 'SVC-000002', name: 'Hand Embroidery', cost: 500, unit: 'Piece' },
    { id: 'SVC-000003', name: 'Machine Embroidery', cost: 300, unit: 'Piece' }
  ]

  const [products, setProducts] = useState([
    {
      id: '1',
      sku: 'PRD-000001',
      name: 'Designer Kurti Set',
      description: 'Elegant kurti with palazzo',
      category: 'Kurti Set',
      materials: [
        { materialId: 'MAT-000001', name: 'Banarasi Silk', quantity: 2.5, cost: 450 },
        { materialId: 'MAT-000003', name: 'Gold Zari Thread', quantity: 2, cost: 25 }
      ],
      services: [
        { serviceId: 'SVC-000001', name: 'Kurti Stitching', quantity: 1, cost: 150 },
        { serviceId: 'SVC-000002', name: 'Hand Embroidery', quantity: 1, cost: 500 }
      ],
      markupPercent: 40,
      status: 'Active'
    },
    {
      id: '2',
      sku: 'PRD-000002',
      name: 'Cotton Palazzo Set',
      description: 'Comfortable summer wear',
      category: 'Palazzo Set',
      materials: [
        { materialId: 'MAT-000002', name: 'Cotton Linen', quantity: 3, cost: 120 }
      ],
      services: [
        { serviceId: 'SVC-000001', name: 'Kurti Stitching', quantity: 1, cost: 150 }
      ],
      markupPercent: 35,
      status: 'Active'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showBOMModal, setShowBOMModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingBOM, setEditingBOM] = useState(false)
  const [bomMaterials, setBomMaterials] = useState([])
  const [bomServices, setBomServices] = useState([])

  const categories = ['All', 'Kurti Set', 'Palazzo Set', 'Saree Blouse', 'Lehenga', 'Salwar Kameez']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const calculateCosts = (product) => {
    const materialCost = product.materials.reduce((sum, m) => sum + (m.quantity * m.cost), 0)
    const serviceCost = product.services.reduce((sum, s) => sum + (s.quantity * s.cost), 0)
    const baseCost = materialCost + serviceCost
    const sellingPrice = baseCost * (1 + product.markupPercent / 100)
    const profit = sellingPrice - baseCost
    
    return { materialCost, serviceCost, baseCost, sellingPrice, profit }
  }

  const generateSKU = () => {
    const maxId = products.reduce((max, p) => {
      const num = parseInt(p.sku.split('-')[1])
      return num > max ? num : max
    }, 0)
    return `PRD-${String(maxId + 1).padStart(6, '0')}`
  }

  const handleDuplicate = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      sku: generateSKU(),
      name: `${product.name} (Copy)`
    }
    setProducts([...products, newProduct])
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleExport = () => {
    const csvData = filteredProducts.map(p => {
      const costs = calculateCosts(p)
      return {
        SKU: p.sku,
        Name: p.name,
        Category: p.category,
        'Material Cost': costs.materialCost,
        'Service Cost': costs.serviceCost,
        'Base Cost': costs.baseCost,
        'Selling Price': costs.sellingPrice.toFixed(2),
        'Profit': costs.profit.toFixed(2),
        'Markup %': p.markupPercent,
        Status: p.status
      }
    })
    
    const headers = Object.keys(csvData[0]).join(',')
    const rows = csvData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleDownloadTemplate = () => {
    const template = `Name,Description,Category,Markup %,Status
Designer Kurti,Elegant kurti set,Kurti Set,40,Active
Cotton Palazzo,Summer wear,Palazzo Set,35,Active`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products_template.csv'
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

  const handleEditBOM = (product) => {
    setSelectedProduct(product)
    setBomMaterials([...product.materials])
    setBomServices([...product.services])
    setEditingBOM(true)
    setShowBOMModal(true)
  }

  const handleViewBOM = (product) => {
    setSelectedProduct(product)
    setEditingBOM(false)
    setShowBOMModal(true)
  }

  const handleAddMaterial = (materialId) => {
    const material = availableMaterials.find(m => m.id === materialId)
    if (material && !bomMaterials.find(m => m.materialId === materialId)) {
      setBomMaterials([...bomMaterials, {
        materialId: material.id,
        name: material.name,
        quantity: 1,
        cost: material.cost
      }])
    }
  }

  const handleAddService = (serviceId) => {
    const service = availableServices.find(s => s.id === serviceId)
    if (service && !bomServices.find(s => s.serviceId === serviceId)) {
      setBomServices([...bomServices, {
        serviceId: service.id,
        name: service.name,
        quantity: 1,
        cost: service.cost
      }])
    }
  }

  const handleRemoveMaterial = (index) => {
    setBomMaterials(bomMaterials.filter((_, i) => i !== index))
  }

  const handleRemoveService = (index) => {
    setBomServices(bomServices.filter((_, i) => i !== index))
  }

  const handleUpdateMaterialQuantity = (index, quantity) => {
    const updated = [...bomMaterials]
    updated[index].quantity = parseFloat(quantity)
    setBomMaterials(updated)
  }

  const handleUpdateServiceQuantity = (index, quantity) => {
    const updated = [...bomServices]
    updated[index].quantity = parseFloat(quantity)
    setBomServices(updated)
  }

  const handleSaveBOM = () => {
    setProducts(products.map(p => 
      p.id === selectedProduct.id
        ? { ...p, materials: bomMaterials, services: bomServices }
        : p
    ))
    setShowBOMModal(false)
    setEditingBOM(false)
    alert('BOM updated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Manage made-to-measure product templates with BOM</p>
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
            onClick={() => alert('Add Product functionality - will be added in next update')}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active Products</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Set(products.map(p => p.category)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Avg Selling Price</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{Math.round(products.reduce((sum, p) => sum + calculateCosts(p).sellingPrice, 0) / products.length)}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const costs = calculateCosts(product)
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{product.sku}</p>
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    product.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                {/* Cost Breakdown */}
                <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Materials:</span>
                    <span className="font-medium">₹{costs.materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-medium">₹{costs.serviceCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Base Cost:</span>
                    <span className="font-medium">₹{costs.baseCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Markup ({product.markupPercent}%):</span>
                    <span className="font-medium text-green-600">+₹{costs.profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                    <span>Selling Price:</span>
                    <span className="text-pink-600">₹{costs.sellingPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* BOM Info */}
                <div className="mb-4 text-sm">
                  <p className="text-gray-600">
                    {product.materials.length} Materials • {product.services.length} Services
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBOM(product)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    Edit BOM
                  </button>
                  <button
                    onClick={() => handleDuplicate(product)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* BOM Modal */}
      {showBOMModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {editingBOM ? 'Edit' : 'View'} BOM - {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setShowBOMModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Materials Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Materials</h3>
                  {editingBOM && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddMaterial(e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="">+ Add Material</option>
                      {availableMaterials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (₹{m.cost}/{m.unit})</option>
                      ))}
                    </select>
                  )}
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Cost/Unit</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      {editingBOM && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(editingBOM ? bomMaterials : selectedProduct.materials).map((m, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{m.name}</td>
                        <td className="px-4 py-2 text-right">
                          {editingBOM ? (
                            <input
                              type="number"
                              step="0.1"
                              value={m.quantity}
                              onChange={(e) => handleUpdateMaterialQuantity(idx, e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                            />
                          ) : (
                            m.quantity
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">₹{m.cost}</td>
                        <td className="px-4 py-2 text-right font-medium">₹{(m.quantity * m.cost).toFixed(2)}</td>
                        {editingBOM && (
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleRemoveMaterial(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Services Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Services</h3>
                  {editingBOM && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddService(e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="">+ Add Service</option>
                      {availableServices.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (₹{s.cost}/{s.unit})</option>
                      ))}
                    </select>
                  )}
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Service</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Cost/Unit</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      {editingBOM && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(editingBOM ? bomServices : selectedProduct.services).map((s, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{s.name}</td>
                        <td className="px-4 py-2 text-right">
                          {editingBOM ? (
                            <input
                              type="number"
                              step="0.1"
                              value={s.quantity}
                              onChange={(e) => handleUpdateServiceQuantity(idx, e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                            />
                          ) : (
                            s.quantity
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">₹{s.cost}</td>
                        <td className="px-4 py-2 text-right font-medium">₹{(s.quantity * s.cost).toFixed(2)}</td>
                        {editingBOM && (
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleRemoveService(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                {(() => {
                  const mats = editingBOM ? bomMaterials : selectedProduct.materials
                  const servs = editingBOM ? bomServices : selectedProduct.services
                  const matCost = mats.reduce((sum, m) => sum + (m.quantity * m.cost), 0)
                  const servCost = servs.reduce((sum, s) => sum + (s.quantity * s.cost), 0)
                  const base = matCost + servCost
                  const selling = base * (1 + selectedProduct.markupPercent / 100)
                  const profit = selling - base
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Material Cost:</span>
                        <span>₹{matCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Service Cost:</span>
                        <span>₹{servCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Base Cost:</span>
                        <span className="font-semibold">₹{base.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Markup ({selectedProduct.markupPercent}%):</span>
                        <span className="text-green-600">+₹{profit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-lg">Selling Price:</span>
                        <span className="font-bold text-lg text-pink-600">₹{selling.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="flex justify-end gap-3">
                {editingBOM ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingBOM(false)
                        setShowBOMModal(false)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBOM}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowBOMModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
