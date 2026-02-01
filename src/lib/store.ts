import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')
const VEH_FILE = path.join(DATA_DIR, 'vehicles.json')
const EMAIL_FILE = path.join(DATA_DIR, 'emailLogs.json')

// If the runtime filesystem is read-only (serverless), fall back to an in-memory store.
let USE_FS = true
try {
  // Ensure data dir exists and is writable. If any step fails, disable FS usage.
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)
  // Try touching the files if absent
  if (!fs.existsSync(VEH_FILE)) fs.writeFileSync(VEH_FILE, '[]')
  if (!fs.existsSync(EMAIL_FILE)) fs.writeFileSync(EMAIL_FILE, '[]')
  // verify we can write a temp file
  const tmp = path.join(DATA_DIR, '.writetest')
  fs.writeFileSync(tmp, 'ok')
  fs.unlinkSync(tmp)
} catch (err) {
  USE_FS = false
}

// In-memory caches used when filesystem is not writable.
let vehiclesCache: any[] | null = null
let emailLogsCache: any[] | null = null

function ensure() {
  // noop when FS not available
  if (!USE_FS) return
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)
  if (!fs.existsSync(VEH_FILE)) fs.writeFileSync(VEH_FILE, '[]')
  if (!fs.existsSync(EMAIL_FILE)) fs.writeFileSync(EMAIL_FILE, '[]')
}

export type Vehicle = {
  id: string
  vehicleNumber: string
  category: string
  location: string
  revenueLicenseExpiry: string
  insuranceExpiry: string
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export async function getVehicles(): Promise<Vehicle[]> {
  ensure()
  if (!USE_FS) {
    if (vehiclesCache === null) {
      try {
        // try to read once (may fail in read-only bundling environments)
        const txt = await fs.promises.readFile(VEH_FILE, 'utf-8')
        vehiclesCache = JSON.parse(txt)
      } catch (err) {
        vehiclesCache = []
      }
    }
    return (vehiclesCache ?? []) as Vehicle[]
  }
  const txt = await fs.promises.readFile(VEH_FILE, 'utf-8')
  return JSON.parse(txt) as Vehicle[]
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const all = await getVehicles()
  return all.find(v => v.id === id) ?? null
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  const all = await getVehicles()
  const now = new Date().toISOString()
  const v: Vehicle = {
    id: uuidv4(),
    vehicleNumber: String(data.vehicleNumber || ''),
    category: String(data.category || 'Van'),
    location: String(data.location || 'Malkaduwawa'),
    revenueLicenseExpiry: String(data.revenueLicenseExpiry || ''),
    insuranceExpiry: String(data.insuranceExpiry || ''),
    notes: data.notes ?? null,
    createdAt: now,
    updatedAt: now,
  }
  all.unshift(v)
  if (USE_FS) {
    await fs.promises.writeFile(VEH_FILE, JSON.stringify(all, null, 2))
  } else {
    vehiclesCache = all
  }
  return v
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
  const all = await getVehicles()
  const idx = all.findIndex(v => v.id === id)
  if (idx === -1) return null
  const now = new Date().toISOString()
  const updated = { ...all[idx], ...data, updatedAt: now }
  all[idx] = updated
  if (USE_FS) {
    await fs.promises.writeFile(VEH_FILE, JSON.stringify(all, null, 2))
  } else {
    vehiclesCache = all
  }
  return updated
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const all = await getVehicles()
  const filtered = all.filter(v => v.id !== id)
  if (filtered.length === all.length) return false
  if (USE_FS) {
    await fs.promises.writeFile(VEH_FILE, JSON.stringify(filtered, null, 2))
  } else {
    vehiclesCache = filtered
  }
  return true
}

export type EmailLog = { id: string; to: string; subject: string; body: string; sentAt: string }

export async function addEmailLog(entry: Omit<EmailLog, 'id' | 'sentAt'>) {
  ensure()
  let all: EmailLog[]
  if (!USE_FS) {
    if (emailLogsCache === null) {
      try {
        all = JSON.parse(await fs.promises.readFile(EMAIL_FILE, 'utf-8')) as EmailLog[]
      } catch (err) {
        all = []
      }
    } else {
      all = emailLogsCache
    }
  } else {
    all = JSON.parse(await fs.promises.readFile(EMAIL_FILE, 'utf-8')) as EmailLog[]
  }
  const e: EmailLog = { id: uuidv4(), sentAt: new Date().toISOString(), ...entry }
  all.unshift(e)
  if (USE_FS) {
    await fs.promises.writeFile(EMAIL_FILE, JSON.stringify(all, null, 2))
  } else {
    emailLogsCache = all
  }
  return e
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  ensure()
  if (!USE_FS) {
    if (emailLogsCache === null) {
      try {
        const txt = await fs.promises.readFile(EMAIL_FILE, 'utf-8')
        emailLogsCache = JSON.parse(txt)
      } catch (err) {
        emailLogsCache = []
      }
    }
    return (emailLogsCache ?? []) as EmailLog[]
  }
  const txt = await fs.promises.readFile(EMAIL_FILE, 'utf-8')
  return JSON.parse(txt) as EmailLog[]
}
