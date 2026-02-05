import { NextResponse } from 'next/server'
import { sendExpiryEmail } from '../../../src/lib/mail'

export async function POST(req: Request) {
    try {
        const { to } = await req.json()
        const recipient = to || 'sandaruthsiriwardana@gmail.com'

        const subject = 'Test Email - NSDS Vehicle System'
        const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111">
        <h2>Test Email from NSDS Vehicle Expiry System</h2>
        <p>This is a test email to verify that email sending is working correctly on Vercel.</p>
        <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.VERCEL ? 'Vercel Production' : 'Local Development'}</p>
        <p style="color: #238636; font-weight: bold;">✅ Email system is working correctly!</p>
      </div>
    `

        await sendExpiryEmail(recipient, subject, html)

        return NextResponse.json({
            success: true,
            message: `Test email sent successfully to ${recipient}`,
            sentAt: new Date().toISOString()
        })
    } catch (error: any) {
        console.error('[Test Email] Failed to send:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to send test email',
            details: error.toString()
        }, { status: 500 })
    }
}
