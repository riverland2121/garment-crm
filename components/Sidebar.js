'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Orders', href: '/dashboard/orders', icon: '📝' },
    { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
    { name: 'Materials', href: '/dashboard/materials', icon: '📦' },
    { name: 'Services', href: '/dashboard/services', icon: '🛠️' },
    { name: 'Service Providers', href: '/dashboard/service-providers', icon: '👨‍🔧' },
    { name: 'Products', href: '/dashboard/products', icon: '👗' },
    { name: 'Invoices', href: '/dashboard/invoices', icon: '🧾' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">👗 Garment CRM</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@garmentcrm.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
