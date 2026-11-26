
import { useState } from 'react'

function BloodDonor() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [location, setLocation] = useState('')
  const [searched, setSearched] = useState(false)

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

  return (
    <section className="blood-section">
      <h2>🩸 Blood Donor Finder</h2>
      <p>Find blood donors near your location</p>

      <div className="blood-search">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <input
          type="text"
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
  )
}

export default BloodDonor
