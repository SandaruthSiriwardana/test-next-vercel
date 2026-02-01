import "./styles/globals.css"

export const metadata = {
  title: "NSDS Vehicle Expiry"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen p-4 sm:p-6 md:p-10" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="max-w-full sm:max-w-3xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
