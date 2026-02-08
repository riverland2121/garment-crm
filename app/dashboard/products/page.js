'use client'

import { useState } from 'react'
import { Plus, Search, Download, Edit, Trash2, Copy } from 'lucide-react'

export default function ProductsPage() {
  // Sample products with BOM
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
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showBOMModal, setShowBOMModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Categories
  const categories = ['All', 'Kurti Set', 'Palazzo Set', 'Saree Blouse', 'Lehenga', 'Salwar Kameez']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Calculate costs
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
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowBOMModal(true)
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    View BOM
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
              <h2 className="text-2xl font-bold mb-4">
                Bill of Materials - {selectedProduct.name}
              </h2>
              
              {/* Materials */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Materials</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Cost/Unit</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedProduct.materials.map((m, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{m.name}</td>
                        <td className="px-4 py-2 text-right">{m.quantity}</td>
                        <td className="px-4 py-2 text-right">₹{m.cost}</td>
                        <td className="px-4 py-2 text-right font-medium">₹{(m.quantity * m.cost).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Services</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Service</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Cost/Unit</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedProduct.services.map((s, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{s.name}</td>
                        <td className="px-4 py-2 text-right">{s.quantity}</td>
                        <td className="px-4 py-2 text-right">₹{s.cost}</td>
                        <td className="px-4 py-2 text-right font-medium">₹{(s.quantity * s.cost).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const costs = calculateCosts(selectedProduct)
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Material Cost:</span>
                        <span>₹{costs.materialCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Service Cost:</span>
                        <span>₹{costs.serviceCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Base Cost:</span>
                        <span className="font-semibold">₹{costs.baseCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Markup ({selectedProduct.markupPercent}%):</span>
                        <span className="text-green-600">+₹{costs.profit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-lg">Selling Price:</span>
                        <span className="font-bold text-lg text-pink-600">₹{costs.sellingPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowBOMModal(false)
                    setSelectedProduct(null)
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
