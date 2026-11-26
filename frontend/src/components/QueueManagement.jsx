
import { useState } from 'react'

function QueueManagement() {
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('General Medicine')
  const [token, setToken] = useState(null)

  const bookAppointment = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setToken({
      number: Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      department
    })
    setName('')
  }

  return (
    <section className="queue-section">
      <h2>🏥 Hospital Queue Management</h2>
      <p>Book an appointment and generate your demo token.</p>

      <form onSubmit={bookAppointment} className="queue-form">
        <label>Patient Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter patient name"
          required
        />

        <label>Department</label>
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
        >
          <option>General Medicine</option>
          <option>Cardiology</option>
          <option>Orthopedics</option>
          <option>Neurology</option>
        </select>

        <button type="submit">Generate Queue Token</button>
      </form>

      {token && (
        <div className="token-result">
          <h3>Appointment Confirmed (Demo)</h3>
          <h2>Token #{token.number}</h2>
          <p>Patient: {token.name}</p>
          <p>Department: {token.department}</p>
          <p>Estimated waiting time: Demo estimate only</p>
        </div>
      )}

      <p className="queue-note">
        Demo queue only. Token numbers are not connected to a real hospital.
      </p>
    </section>
  )
}

export default QueueManagement
