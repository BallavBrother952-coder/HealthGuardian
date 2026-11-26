
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        💚 Health Guardian
      </div>

      <div className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#medicine">Medicine</a>
        <a href="#health">Health Readings</a>
        <a href="#voice">Voice Assistant</a>
        <a href="#alerts">Family Alerts</a>
      </div>

      <div className="nav-profile">
        👤 Patient
      </div>
    </nav>
  )
}

export default Navbar
