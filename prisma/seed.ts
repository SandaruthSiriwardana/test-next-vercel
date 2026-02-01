import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  await prisma.vehicle.createMany({ data: [
    { vehicleNumber: 'NSDS-001', category: 'Van', location: 'Malkaduwawa', revenueLicenseExpiry: new Date(Date.now() + 45*24*3600*1000), insuranceExpiry: new Date(Date.now() + 10*24*3600*1000) },
    { vehicleNumber: 'NSDS-002', category: 'Bike', location: 'Alawwa', revenueLicenseExpiry: new Date(Date.now() + 5*24*3600*1000), insuranceExpiry: new Date(Date.now() + 2*24*3600*1000) }
  ]})
}

main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
