import { NextResponse } from 'next/server'
import * as store from '../../../src/lib/store'

export async function GET() {
  try {
    const logs = await store.getEmailLogs()
    return NextResponse.json(logs)
  } catch (err) {
    return NextResponse.json([], { status: 200 })
  }
}
