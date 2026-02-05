import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VehicleForm from '../VehicleForm'

describe('VehicleForm', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn()
  })

  afterEach(() => {
    // @ts-ignore
    global.fetch.mockRestore()
  })

  it('submits form and shows success message', async () => {
    const fakeResponse = { id: 'abc123' }
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => fakeResponse, headers: { get: () => 'application/json' } })

    const onSaved = jest.fn()
    render(<VehicleForm onSaved={onSaved} />)

    await userEvent.type(screen.getByLabelText(/වාහන අංකය/i), 'ABC-123')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(await screen.findByText(/Saved \(id: abc123/i)).toBeInTheDocument()
  })

  it('shows server error message when API returns error', async () => {
    const errorBody = { error: 'vehicleNumber is required' }
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => errorBody, headers: { get: () => 'application/json' } })

    render(<VehicleForm />)

    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(await screen.findByText(/vehicleNumber is required/i)).toBeInTheDocument()
  })
})
