import type { Vehicle } from "@prisma/client"
import { Resend } from "resend"
import nodemailer from "nodemailer"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const resender = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function sendExpiryEmail(to: string, subject: string, html: string) {
  if (resender) {
    await resender.emails.send({
      from: "noreply@newsagarikadrivingschool.com",
      to,
      subject,
      html
    })
    // Log removed
    return
  }

  // Fallback to SMTP via SMTP_URL
  const smtpUrl = process.env.SMTP_URL
  if (!smtpUrl) throw new Error("No email provider configured (RESEND_API_KEY or SMTP_URL)")

  // Explicit Gmail configuration for better compatibility
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'newsagarikadrivingschoolm@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || smtpUrl.split(':')[2]?.split('@')[0] || ''
    }
  })
  await transporter.sendMail({
    from: `"NSDS" <newsagarikadrivingschoolm@gmail.com>`,
    to,
    subject,
    html
  })
}

export function renderVehicleExpiryTemplate(v: Vehicle, expiryType: string) {
  const expiryDate = expiryType === 'revenue' ? v.revenueLicenseExpiry : v.insuranceExpiry
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111">
      <h2>New Sagarika Driving School — Vehicle expiry notice</h2>
      <p>Vehicle: <strong>${v.vehicleNumber}</strong></p>
      <p>Category: ${v.category}</p>
      <p>Location: ${v.location}</p>
      <p>Expiry Type: ${expiryType}</p>
      <p>Expiry Date: ${new Date(expiryDate).toLocaleDateString()}</p>
      <p><a href="${process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '#')}">Login to NSDS</a></p>
    </div>
  `
}
