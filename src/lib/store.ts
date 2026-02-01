import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')
const VEH_FILE = path.join(DATA_DIR, 'vehicles.json')
const EMAIL_FILE = path.join(DATA_DIR, 'emailLogs.json')

function ensure() {
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
  await fs.promises.writeFile(VEH_FILE, JSON.stringify(all, null, 2))
  return v
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
  const all = await getVehicles()
  const idx = all.findIndex(v => v.id === id)
  if (idx === -1) return null
  const now = new Date().toISOString()
  const updated = { ...all[idx], ...data, updatedAt: now }
  all[idx] = updated
  await fs.promises.writeFile(VEH_FILE, JSON.stringify(all, null, 2))
  return updated
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const all = await getVehicles()
  const filtered = all.filter(v => v.id !== id)
  if (filtered.length === all.length) return false
  await fs.promises.writeFile(VEH_FILE, JSON.stringify(filtered, null, 2))
  return true
}

export type EmailLog = { id: string; to: string; subject: string; body: string; sentAt: string }

export async function addEmailLog(entry: Omit<EmailLog, 'id' | 'sentAt'>) {
  ensure()
  const all = JSON.parse(await fs.promises.readFile(EMAIL_FILE, 'utf-8')) as EmailLog[]
  const e: EmailLog = { id: uuidv4(), sentAt: new Date().toISOString(), ...entry }
  all.unshift(e)
  await fs.promises.writeFile(EMAIL_FILE, JSON.stringify(all, null, 2))
  return e
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  ensure()
  const txt = await fs.promises.readFile(EMAIL_FILE, 'utf-8')
  return JSON.parse(txt) as EmailLog[]
}
