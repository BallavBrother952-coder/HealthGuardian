
import { useState } from 'react'

function PatientMonitoring() {
  const [readings, setReadings] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    oxygen: 98,
    temperature: 36.8
  })

  const [history, setHistory] = useState([
    { time: '08:00 AM', heart: 72, oxygen: 98 },
    { time: '10:00 AM', heart: 76, oxygen: 97 },
    { time: '12:00 PM', heart: 74, oxygen: 98 },
    { time: '02:00 PM', heart: 72, oxygen: 98 }
  ])

  const updateReadings = () => {
    const newReadings = {
      heartRate: 105,
      bloodPressure: '130/85',
      oxygen: 94,
      temperature: 38.2
    }

    setReadings(newReadings)

    setHistory(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        heart: newReadings.heartRate,
        oxygen: newReadings.oxygen
      }
    ])
  }

  const resetReadings = () => {
    setReadings({
      heartRate: 72,
      bloodPressure: '120/80',
      oxygen: 98,
      temperature: 36.8
    })
  }

  const alerts = []

  if (readings.heartRate > 100)
    alerts.push('Heart rate is above the demo threshold.')

  if (readings.oxygen < 95)
    alerts.push('Oxygen level is below the demo threshold.')

  if (readings.temperature > 38)
    alerts.push('Temperature is above the demo threshold.')

  return (
    <section className="monitor-section">

      <h2>📊 Patient Monitoring</h2>
      <p>Monitor your health readings</p>

      <div className="monitor-grid">

        <div className="monitor-card">
          <h3>❤️ Heart Rate</h3>
          <h2>{readings.heartRate} BPM</h2>
          <p>Sample Reading</p>
        </div>

        <div className="monitor-card">
          <h3>🩺 Blood Pressure</h3>
          <h2>{readings.bloodPressure}</h2>
          <p>Sample Reading</p>
        </div>

        <div className="monitor-card">
          <h3>🫁 Oxygen Level</h3>
          <h2>{readings.oxygen}%</h2>
          <p>Sample Reading</p>
        </div>

        <div className="monitor-card">
          <h3>🌡️ Temperature</h3>
          <h2>{readings.temperature}°C</h2>
          <p>Sample Reading</p>
        </div>

      </div>

      <div className="monitor-alert">
        <h3>🚨 Health Alerts</h3>

        {alerts.length === 0 ? (
          <p className="normal-alert">
            No demo alerts. Sample readings are within configured demo limits.
          </p>
        ) : (
          alerts.map((alert, index) => (
            <p className="warning-alert" key={index}>
              ⚠️ {alert}
            </p>
          ))
        )}
      </div>

      <div className="monitor-actions">
        <button onClick={updateReadings}>
          Update Sample Readings
        </button>

        <button onClick={resetReadings}>
          Reset Readings
        </button>
      </div>

      <div className="monitor-history">
        <h3>📈 Patient Health History</h3>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Heart Rate</th>
              <th>Oxygen</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.time}</td>
                <td>{item.heart} BPM</td>
                <td>{item.oxygen}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="demo-note">
        Note: All readings are simulated demo data, not real patient measurements.
      </p>

    </section>
  )
}

export default PatientMonitoring
