export const metadata = {
  title: 'Garment CRM',
  description: 'Business Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
