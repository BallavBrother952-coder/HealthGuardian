
import { useState } from 'react'

function PatientCheckin() {
  const [status, setStatus] = useState('')

  return (
    <section className="checkin" id="checkin">
      <h2>🏥 Patient Check-in</h2>
      <p>How are you feeling today?</p>

      <div className="checkin-buttons">
        <button onClick={() => setStatus("I'm Fine")}>
          😊 I'm Fine
        </button>

        <button onClick={() => setStatus('Need Help')}>
          🆘 Need Help
        </button>
      </div>

      {status && (
        <p className="checkin-status">
          Your Status: <strong>{status}</strong>
        </p>
      )}
    </section>
  )
}

export default PatientCheckin
