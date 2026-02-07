'use client'

export default function DashboardPage() {
  // Sample data - will be replaced with real data later
  const stats = [
    {
      title: 'Total Orders',
      value: '124',
      change: '+12%',
      trend: 'up',
      icon: '📝',
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+5 new',
      trend: 'up',
      icon: '👥',
      color: 'green'
    },
    {
      title: 'Low Stock Items',
      value: '7',
      change: 'Need attention',
      trend: 'warning',
      icon: '⚠️',
      color: 'orange'
    },
    {
      title: 'Revenue (Month)',
      value: '₹2,45,000',
      change: '+18%',
      trend: 'up',
      icon: '💰',
      color: 'purple'
    },
  ]

  const recentOrders = [
    { 
      id: 'ORD-001', 
      customer: 'Priya Sharma', 
      item: 'Designer Kurti Set', 
      status: 'In Progress',
      delivery: '2026-02-15',
      amount: '₹4,500'
    },
    { 
      id: 'ORD-002', 
      customer: 'Ananya Gupta', 
      item: 'Bridal Lehenga', 
      status: 'Pending',
      delivery: '2026-03-10',
      amount: '₹45,000'
    },
    { 
      id: 'ORD-003', 
      customer: 'Sneha Patel', 
      item: 'Palazzo Set', 
      status: 'Ready',
      delivery: '2026-02-08',
      amount: '₹2,800'
    },
    { 
      id: 'ORD-004', 
      customer: 'Kavya Singh', 
      item: 'Anarkali Suit', 
      status: 'Delivered',
      delivery: '2026-02-05',
      amount: '₹6,200'
    },
  ]

  const todayDeliveries = [
    { customer: 'Sneha Patel', item: 'Palazzo Set', time: '2:00 PM' },
    { customer: 'Ritu Verma', item: 'Saree Blouse', time: '4:30 PM' },
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Ready': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-500'
      case 'green': return 'bg-green-500'
      case 'orange': return 'bg-orange-500'
      case 'purple': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${getStatColor(stat.color)} bg-opacity-10 flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-xs ${stat.trend === 'warning' ? 'text-orange-600' : 'text-green-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.delivery}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Deliveries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Deliveries</h2>
        <div className="space-y-3">
          {todayDeliveries.map((delivery, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-900">{delivery.customer}</p>
                  <p className="text-sm text-gray-600">{delivery.item}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-700">{delivery.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
