
import { useState } from 'react'

function MedicineReminder() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', time: '08:00 AM', taken: false },
    { id: 2, name: 'Vitamin D', time: '02:00 PM', taken: false },
    { id: 3, name: 'Calcium', time: '08:00 PM', taken: false }
  ])

  const markAsTaken = (id) => {
    setMedicines((previous) =>
      previous.map((medicine) =>
        medicine.id === id
          ? { ...medicine, taken: !medicine.taken }
          : medicine
      )
    )
  }

  return (
    <section className="medicine-section" id="medicine">
      <h2>💊 Medicine Reminders</h2>
      <p>Keep track of your daily medicines</p>

      {medicines.map((medicine) => (
        <div className="medicine-item" key={medicine.id}>
          <div>
            <h3>{medicine.name}</h3>
            <p>⏰ {medicine.time}</p>
            <span className={medicine.taken ? 'taken' : 'pending'}>
              {medicine.taken ? 'Taken' : 'Pending'}
            </span>
          </div>

          <button
            onClick={() => markAsTaken(medicine.id)}
            disabled={medicine.taken}
          >
            {medicine.taken ? 'Completed ✓' : 'Mark as Taken'}
          </button>
        </div>
      ))}
    </section>
  )
}

export default MedicineReminder
