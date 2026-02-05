import "./styles/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NSDS Vehicle Expiry"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen p-4 sm:p-6 md:p-10 ${inter.className}`} style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#161b22',
            color: '#fff',
            border: '1px solid #30363d',
          },
        }} />
        <div className="max-w-full sm:max-w-3xl mx-auto">{children}</div>
        <footer className="mt-16 border-t border-[#30363d] pt-8 pb-8 text-center">
          <p className="text-sm text-gray-400 font-medium">Developed by Sandaruth Siriwardana</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} NSDS Inc.</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
