// Compare.jsx — Shows side by side comparison of all deals
// User clicks "Compare All" on results page to come here

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Compare.css'

function Compare() {
  const { searchId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search/${searchId}`
        )
        setSearch(response.data.search)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchSearch()
  }, [searchId])

  if (loading) {
    return (
      <div className="compare-container">
        <div className="loading-box">
          <div className="spinner">⚖️</div>
          <h2>Loading comparison...</h2>
        </div>
      </div>
    )
  }

  const results = search?.results || []
  const productData = search?.productData

  // Scoring criteria for comparison
  const criteria = [
    { key: 'price',    label: 'Price',     icon: '💰' },
    { key: 'website',  label: 'Website',   icon: '🏪' },
    { key: 'rating',   label: 'Rating',    icon: '⭐' },
    { key: 'delivery', label: 'Delivery',  icon: '🚚' },
    { key: 'rank',     label: 'AI Rank',   icon: '🤖' }
  ]

  return (
    <div className="compare-container">

      {/* Header */}
      <div className="compare-header">
        <button
          className="back-btn"
          onClick={() => navigate(`/results/${searchId}`)}
        >
          ← Back to Results
        </button>
        <div className="compare-title">
          <h1>⚖️ Full Comparison</h1>
          <p>{productData?.productName}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="compare-wrapper">
        <div className="compare-table">

          {/* Column headers — one per result */}
          <div className="compare-row header-row">
            <div className="compare-cell label-cell"></div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell header-cell ${index === 0 ? 'best' : ''}`}
              >
                <div className="medal">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${result.rank}`}
                </div>
                <div className="website-name">{result.website}</div>
                <div className="product-title-small">{result.title?.slice(0, 40)}...</div>
              </div>
            ))}
          </div>

          {/* Price Row */}
          <div className="compare-row">
            <div className="compare-cell label-cell">
              <span>💰</span> Price
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell ${index === 0 ? 'best' : ''}`}
              >
                <strong>{result.price}</strong>
              </div>
            ))}
          </div>

          {/* Rating Row */}
          <div className="compare-row">
            <div className="compare-cell label-cell">
              <span>⭐</span> Rating
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell ${index === 0 ? 'best' : ''}`}
              >
                {result.rating || 'N/A'}
              </div>
            ))}
          </div>

          {/* Delivery Row */}
          <div className="compare-row">
            <div className="compare-cell label-cell">
              <span>🚚</span> Delivery
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell ${index === 0 ? 'best' : ''}`}
              >
                {result.deliveryInfo || 'N/A'}
              </div>
            ))}
          </div>

          {/* AI Rank Row */}
          <div className="compare-row">
            <div className="compare-cell label-cell">
              <span>🤖</span> AI Rank
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell ${index === 0 ? 'best' : ''}`}
              >
                #{result.rank}
              </div>
            ))}
          </div>

          {/* Why Ranked Row */}
          <div className="compare-row why-row">
            <div className="compare-cell label-cell">
              <span>💡</span> Why this rank?
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell why-cell ${index === 0 ? 'best' : ''}`}
              >
                {result.whyRanked}
              </div>
            ))}
          </div>

          {/* Buy Button Row */}
          <div className="compare-row">
            <div className="compare-cell label-cell"></div>
            {results.map((result, index) => (
              <div
                key={index}
                className={`compare-cell ${index === 0 ? 'best' : ''}`}
              >
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`buy-btn ${index === 0 ? 'buy-btn-primary' : 'buy-btn-secondary'}`}
                >
                  Buy Now →
                </a>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Compare