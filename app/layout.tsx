import "./styles/globals.css"

export const metadata = {
  title: "NSDS Vehicle Expiry"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen p-4 sm:p-6 md:p-10" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="max-w-full sm:max-w-3xl mx-auto">{children}</div>
        <footer className="mt-12 text-center text-xs text-gray-500 pb-4">
          <p>Developed by Sandaruth Siriwardana</p>
          <p className="mt-1 opacity-50">Version 0.1.0</p>
        </footer>
      </body>
    </html>
  )
}
