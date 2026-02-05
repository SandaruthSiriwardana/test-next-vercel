import Dashboard from "../src/components/Dashboard"

export default function Page() {
  return (
    <main className="p-4 sm:p-6 space-y-8">
      <div className="flex flex-col items-center justify-center space-y-2 py-4 border-b border-[#30363d] mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 text-center tracking-tight">
          New Sagarika Driving School
        </h1>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Vehicle Expiry Management System
        </p>
      </div>
      <Dashboard />
    </main>
  )
}
