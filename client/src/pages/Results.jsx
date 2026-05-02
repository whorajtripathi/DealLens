// // Results.jsx — Polls backend every 2 seconds until Gemini analysis is done
// // Then displays what Gemini understood about the product

// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import './Results.css'

// function Results() {
//   const { searchId } = useParams()
//   const navigate = useNavigate()
//   const [search, setSearch] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     // Poll every 2 seconds until status is 'analyzed' or 'completed'
//     const interval = setInterval(async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/search/${searchId}`
//         )
//         const data = response.data.search

//         setSearch(data)

//         // Stop polling when Gemini is done
//         if (data.status === 'analyzed' || data.status === 'completed') {
//           setLoading(false)
//           clearInterval(interval)
//         }

//         // Stop polling if failed
//         if (data.status === 'failed') {
//           setError('Analysis failed. Please try again.')
//           setLoading(false)
//           clearInterval(interval)
//         }

//       } catch (err) {
//         console.error('Polling error:', err)
//         setError('Could not fetch results')
//         setLoading(false)
//         clearInterval(interval)
//       }
//     }, 2000) // poll every 2 seconds

//     // Cleanup — stop polling when component unmounts
//     return () => clearInterval(interval)
//   }, [searchId])

//   if (error) {
//     return (
//       <div className="results-container">
//         <div className="error-box">
//           <h2>❌ {error}</h2>
//           <button onClick={() => navigate('/')}>Try Again</button>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="results-container">
//         <div className="loading-box">
//           <div className="spinner">🔍</div>
//           <h2>Analyzing your product...</h2>
//           <p>Gemini AI is reading your image and finding details</p>
//           <div className="steps">
//             <p>✅ Image uploaded</p>
//             <p>⏳ AI analyzing product...</p>
//             <p>⏳ Searching best deals...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const productData = search?.productData

//   return (
//     <div className="results-container">

//       {/* Product Analysis Card */}
//       <div className="analysis-card">
//         <h2>🧠 Product Identified</h2>

//         <div className="product-grid">
//           <div className="product-field">
//             <span className="label">Product</span>
//             <span className="value">{productData?.productName}</span>
//           </div>
//           <div className="product-field">
//             <span className="label">Category</span>
//             <span className="value">{productData?.category}</span>
//           </div>
//           <div className="product-field">
//             <span className="label">Brand</span>
//             <span className="value">{productData?.brand}</span>
//           </div>
//           <div className="product-field">
//             <span className="label">Color</span>
//             <span className="value">{productData?.color}</span>
//           </div>
//           <div className="product-field">
//             <span className="label">Material</span>
//             <span className="value">{productData?.material}</span>
//           </div>
//           <div className="product-field">
//             <span className="label">Est. Price</span>
//             <span className="value">{productData?.estimatedPriceRange}</span>
//           </div>
//         </div>

//         {/* Key features */}
//         {productData?.keyFeatures?.length > 0 && (
//           <div className="features">
//             <span className="label">Key Features</span>
//             <div className="tags">
//               {productData.keyFeatures.map((f, i) => (
//                 <span key={i} className="tag">{f}</span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Search query Gemini built */}
//         <div className="search-query">
//           <span className="label">🔍 Searching for</span>
//           <span className="query-text">"{productData?.searchQuery}"</span>
//         </div>

//         {/* Uploaded image */}
//         {search?.imageUrl && (
//           <img
//             src={search.imageUrl}
//             alt="Uploaded product"
//             className="uploaded-image"
//           />
//         )}
//       </div>

//       <div className="coming-soon">
//         <h3>⏳ Phase 4 coming next!</h3>
//         <p>We'll now search Amazon, Flipkart & more using this query and rank the best deals for you.</p>
//       </div>

//     </div>
//   )
// }

// export default Results

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Results.css'

function Results() {
  const { searchId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('processing')
  const [error, setError] = useState('')
  const [expandedCard, setExpandedCard] = useState(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search/${searchId}`
        )
        const data = response.data.search
        setSearch(data)
        setStatus(data.status)

        // Stop polling when done
        if (data.status === 'completed') {
          setLoading(false)
          clearInterval(interval)
        }

        if (data.status === 'failed') {
          setError('Search failed. Please try again.')
          setLoading(false)
          clearInterval(interval)
        }

      } catch (err) {
        console.error('Polling error:', err)
        setError('Could not fetch results')
        setLoading(false)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [searchId])

  // Loading screen with live status
  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-box">
          <div className="spinner">🔍</div>
          <h2>Finding best deals...</h2>
          <p>This takes about 10-15 seconds</p>
          <div className="steps">
            <p>✅ Image uploaded to cloud</p>
            <p>
              {status === 'processing' ? '⏳' : '✅'}
              {' '}AI analyzing product...
            </p>
            <p>
              {status === 'completed' || status === 'analyzed' ? '✅' : '⏳'}
              {' '}Searching Amazon, Flipkart...
            </p>
            <p>
              {status === 'completed' ? '✅' : '⏳'}
              {' '}Ranking best deals...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-box">
          <h2>❌ {error}</h2>
          <button onClick={() => navigate('/')}>Try Again</button>
        </div>
      </div>
    )
  }

  const productData = search?.productData
  const results = search?.results || []

  return (
    <div className="results-container">

      {/* ── Product Summary Bar ── */}
      <div className="product-summary">
        <div className="summary-left">
          {search?.imageUrl && (
            <img
              src={search.imageUrl}
              alt="Product"
              className="summary-image"
            />
          )}
          <div className="summary-info">
            <h2>{productData?.productName}</h2>
            <p>{productData?.brand} · {productData?.category} · {productData?.color}</p>
            <span className="price-range">
              Est. {productData?.estimatedPriceRange}
            </span>
          </div>
        </div>
        <button
          className="new-search-btn"
          onClick={() => navigate('/')}
        >
          New Search
        </button>
      </div>

      {/* ── Features Tags ── */}
      {productData?.keyFeatures?.length > 0 && (
        <div className="features-bar">
          {productData.keyFeatures.map((f, i) => (
            <span key={i} className="feature-tag">{f}</span>
          ))}
        </div>
      )}

      {/* ── Results Heading ── */}
      <div className="results-heading">
        <div>
          <h3>🏆 Top {results.length} Deals Found</h3>
          <p>Ranked by price, quality, ratings and delivery</p>
        </div>
        <button className="compare-all-btn" onClick={() => navigate(`/compare/${searchId}`)}>
            ⚖️ Compare All
        </button>
      </div>

      {/* ── Deal Cards ── */}
      <div className="deals-list">
        {results.map((result, index) => (
          <div
            key={index}
            className={`deal-card ${index === 0 ? 'best-deal' : ''}`}
          >
            {/* Rank Badge */}
            <div className="rank-badge">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${result.rank}`}
            </div>

            <div className="deal-content">
              {/* Left side */}
              <div className="deal-left">
                <span className="website-badge">{result.website}</span>
                <h4 className="deal-title">{result.title}</h4>
                <div className="deal-meta">
                  {result.rating !== 'N/A' && (
                    <span className="rating">⭐ {result.rating}</span>
                  )}
                  {result.deliveryInfo !== 'N/A' && (
                    <span className="delivery">🚚 {result.deliveryInfo}</span>
                  )}
                </div>
              </div>

              {/* Right side */}
              <div className="deal-right">
                <div className="deal-price">{result.price}</div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-btn"
                >
                  Buy Now →
                </a>
              </div>
            </div>

            {/* Why ranked — expandable */}
            <div className="why-section">
              <button
                className="why-btn"
                onClick={() =>
                  setExpandedCard(expandedCard === index ? null : index)
                }
              >
                {expandedCard === index ? '▲ Hide' : '▼ Why this rank?'}
              </button>
              {expandedCard === index && (
                <p className="why-text">{result.whyRanked}</p>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Results