// History.jsx — Shows all past searches
// User can click any search to see its results again

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './History.css'

function History() {
  const navigate = useNavigate()
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/search/history')
        setSearches(response.data.searches)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="history-container">
        <p>Loading history...</p>
      </div>
    )
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>🕐 Search History</h1>
        <p>All your past product searches</p>
      </div>

      {searches.length === 0 ? (
        <div className="empty-state">
          <p>No searches yet!</p>
          <button onClick={() => navigate('/')}>Start Searching</button>
        </div>
      ) : (
        <div className="history-list">
          {searches.map((search) => (
            <div
              key={search._id}
              className="history-card"
              onClick={() => navigate(`/results/${search._id}`)}
            >
              <div className="history-left">
                {search.imageUrl ? (
                  <img
                    src={search.imageUrl}
                    alt="Product"
                    className="history-image"
                  />
                ) : (
                  <div className="history-icon">📝</div>
                )}
                <div className="history-info">
                  <h3>{search.productData?.productName || search.productDescription}</h3>
                  <p>{search.productData?.category} · {search.productData?.brand}</p>
                  <p className="history-date">
                    {new Date(search.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="history-right">
                <span className={`status-badge ${search.status}`}>
                  {search.status}
                </span>
                <span className="results-count">
                  {search.results?.length || 0} deals found
                </span>
                <span className="view-btn">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History