
import { useState } from 'react'

function BloodDonor() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [location, setLocation] = useState('')
  const [searched, setSearched] = useState(false)

  const [form, setForm] = useState({
    patientName: '',
    group: '',
    hospital: '',
    city: '',
    phone: '',
    urgency: 'Urgent'
  })

  const [submitted, setSubmitted] = useState(false)

  const donors = [
    { name: 'Rahul Das', group: 'A+', city: 'Kolkata', phone: '9000000001' },
    { name: 'Priya Roy', group: 'B+', city: 'Howrah', phone: '9000000002' },
    { name: 'Amit Ghosh', group: 'O+', city: 'Kolkata', phone: '9000000003' },
    { name: 'Sneha Paul', group: 'AB+', city: 'Siliguri', phone: '9000000004' },
    { name: 'Arjun Sen', group: 'A-', city: 'Howrah', phone: '9000000005' },
  ]

  const filteredDonors = donors.filter((donor) => {
    const matchGroup = !bloodGroup || donor.group === bloodGroup
    const matchLocation = !location ||
      donor.city.toLowerCase().includes(location.toLowerCase())

    return matchGroup && matchLocation
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="blood-section">
        <h2>🩸 Blood Donor Finder</h2>
        <p>Find blood donors near your location</p>

        <div className="blood-search">
          <select value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}>
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <input
            placeholder="Enter your city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button onClick={() => setSearched(true)}>
            Search Donors
          </button>
        </div>

        {searched && (
          <div className="donor-list">
            <h3>Available Donors</h3>
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor, index) => (
                <div className="donor-card" key={index}>
                  <div>
                    <h3>{donor.name}</h3>
                    <p>📍 {donor.city}</p>
                    <p>🩸 Blood Group: {donor.group}</p>
                  </div>
                  <a href={`tel:${donor.phone}`}>
                    <button>Contact Donor</button>
                  </a>
                </div>
              ))
            ) : (
              <p>No matching sample donors found.</p>
            )}
          </div>
        )}
      </section>

      <section className="emergency-section">
        <h2>🚨 Emergency Blood Request</h2>
        <p>Fill in the details to create a demo blood request.</p>

        {submitted ? (
          <div className="success-message">
            <h3>✅ Request Submitted!</h3>
            <p>Your demo request has been recorded on this page.</p>
            <button onClick={() => {
              setSubmitted(false)
              setForm({
                patientName: '',
                group: '',
                hospital: '',
                city: '',
                phone: '',
                urgency: 'Urgent'
              })
            }}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form className="emergency-form" onSubmit={handleSubmit}>
            <label>Patient Name</label>
            <input name="patientName" value={form.patientName}
              onChange={handleChange} placeholder="Enter patient name" required />

            <label>Required Blood Group</label>
            <select name="group" value={form.group}
              onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <label>Hospital Name</label>
            <input name="hospital" value={form.hospital}
              onChange={handleChange} placeholder="Enter hospital name" required />

            <label>Location</label>
            <input name="city" value={form.city}
              onChange={handleChange} placeholder="Enter city or area" required />

            <label>Contact Number</label>
            <input name="phone" type="tel" value={form.phone}
              onChange={handleChange} placeholder="Enter contact number"
              pattern="[0-9]{10}" title="Enter a 10-digit phone number" required />

            <label>Urgency</label>
            <select name="urgency" value={form.urgency}
              onChange={handleChange}>
              <option>Urgent</option>
              <option>Very Urgent</option>
              <option>Normal</option>
            </select>

            <button type="submit">Submit Emergency Request</button>
          </form>
        )}
      </section>
    </>
  )
}

export default BloodDonor
