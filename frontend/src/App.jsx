
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import MedicineReminder from './components/MedicineReminder'
import BloodDonor from './components/BloodDonor'

function App() {
  const [checkin, setCheckin] = useState('')

  return (
    <div className="app">
      <Navbar />

      <main className="dashboard">
        <h2>Patient Dashboard</h2>
        <p>Welcome to your personal health dashboard!</p>

        <div className="cards">
          <div className="card">
            <h3>❤️ Heart Rate</h3>
            <h2>72 BPM</h2>
            <p>Sample Reading</p>
          </div>

          <div className="card">
            <h3>🩺 Blood Pressure</h3>
            <h2>120/80</h2>
            <p>Sample Reading</p>
          </div>

          <div className="card">
            <h3>🫁 Oxygen Level</h3>
            <h2>98%</h2>
            <p>Sample Reading</p>
          </div>

          <div className="card">
            <h3>🌡️ Temperature</h3>
            <h2>36.8°C</h2>
            <p>Sample Reading</p>
          </div>
        </div>

        <MedicineReminder />
        <BloodDonor />

        <section className="checkin">
          <h2>👤 Patient Check-in</h2>
          <p>How are you feeling today?</p>

          <button onClick={() => setCheckin("I'm Fine")}>
            I'm Fine
          </button>

          <button
            className="help-button"
            onClick={() => setCheckin('Need Help')}
          >
            Need Help
          </button>

          {checkin && (
            <p className="checkin-result">
              {checkin === "I'm Fine"
                ? 'Your check-in is recorded in this demo.'
                : 'Help requested in this demo. Please contact your family if you need assistance.'}
            </p>
          )}
        </section>

      </main>
    </div>
  )
}

export default App
