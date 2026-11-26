import { useState } from 'react'
import { sendFamilyAlert } from '../../../voice/familyAlerts.js'

function FamilyAlerts() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const sendAlert = () => {
    if (!message.trim()) return
    setResult(sendFamilyAlert('Demo Patient', message))
  }

  return (
    <section className="voice" id="alerts">
      <h2>Family Alerts</h2>
      <p><strong>SIMULATED DEMO ONLY:</strong> No real family member is notified.</p>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Enter a demo alert message"
        rows="3"
      />
      <br />
      <button onClick={sendAlert}>Create Demo Alert</button>
      {result && <p>Status: {result.status} — Demo alert created.</p>}
    </section>
  )
}

export default FamilyAlerts
