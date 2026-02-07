import './globals.css'

export const metadata = {
  title: 'Garment CRM',
  description: 'Business Management System for Made-to-Measure Garments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
