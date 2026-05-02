import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-logo" onClick={() => navigate('/')}>
          🔍 DealLens
        </div>
        <div className="nav-links">
          <button
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('/')}
          >
            Search
          </button>
          <button
            className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('/history')}
          >
            History
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar