import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import MedicineReminder from './components/MedicineReminder'
import BloodDonor from './components/BloodDonor'
import PatientMonitoring from './components/PatientMonitoring'
import AIChatbot from './components/AIChatbot'
import QueueManagement from './components/QueueManagement'
import VoiceAssistant from './components/VoiceAssistant'
import FamilyAlerts from './components/FamilyAlerts'

function App() {
  const [checkin, setCheckin] = useState('')

  return (
    <div className="app">
      <Navbar />
      <main className="dashboard" id="dashboard">
        <h2>Patient Dashboard</h2>
        <p>Welcome to your personal health dashboard!</p>

        <div id="health">
          <h2>Health Readings (Demo Data)</h2>
          <div className="cards">
            <div className="card">
              <h3>❤️ Heart Rate</h3>
              <h2>72 BPM</h2>
              <p>Sample Reading — Demo Only</p>
            </div>
            <div className="card">
              <h3>🩺 Blood Pressure</h3>
              <h2>120/80</h2>
              <p>Sample Reading — Demo Only</p>
            </div>
            <div className="card">
              <h3>🫁 Oxygen Level</h3>
              <h2>98%</h2>
              <p>Sample Reading — Demo Only</p>
            </div>
            <div className="card">
              <h3>🌡️ Temperature</h3>
              <h2>36.8°C</h2>
              <p>Sample Reading — Demo Only</p>
            </div>
          </div>
        </div>

        <div id="medicine">
          <MedicineReminder />
        </div>

        <BloodDonor />
        <PatientMonitoring />
        <AIChatbot />
        <QueueManagement />

        <section className="checkin">
          <h2>👤 Patient Check-in</h2>
          <p>How are you feeling today?</p>
          <button onClick={() => setCheckin("I'm Fine")}>I'm Fine</button>
          <button className="help-button" onClick={() => setCheckin('Need Help')}>
            Need Help
          </button>
          {checkin && (
            <p className="checkin-result">
              {checkin === "I'm Fine"
                ? 'Your check-in is recorded in this demo.'
                : 'Help requested in this demo only. No real alert was sent.'}
            </p>
          )}
        </section>

        <VoiceAssistant />
        <FamilyAlerts />
      </main>
    </div>
  )
}

export default App
