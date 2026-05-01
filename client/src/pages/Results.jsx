// Results.jsx — Polls backend every 2 seconds until Gemini analysis is done
// Then displays what Gemini understood about the product

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Results.css'

function Results() {
  const { searchId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Poll every 2 seconds until status is 'analyzed' or 'completed'
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search/${searchId}`
        )
        const data = response.data.search

        setSearch(data)

        // Stop polling when Gemini is done
        if (data.status === 'analyzed' || data.status === 'completed') {
          setLoading(false)
          clearInterval(interval)
        }

        // Stop polling if failed
        if (data.status === 'failed') {
          setError('Analysis failed. Please try again.')
          setLoading(false)
          clearInterval(interval)
        }

      } catch (err) {
        console.error('Polling error:', err)
        setError('Could not fetch results')
        setLoading(false)
        clearInterval(interval)
      }
    }, 2000) // poll every 2 seconds

    // Cleanup — stop polling when component unmounts
    return () => clearInterval(interval)
  }, [searchId])

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

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-box">
          <div className="spinner">🔍</div>
          <h2>Analyzing your product...</h2>
          <p>Gemini AI is reading your image and finding details</p>
          <div className="steps">
            <p>✅ Image uploaded</p>
            <p>⏳ AI analyzing product...</p>
            <p>⏳ Searching best deals...</p>
          </div>
        </div>
      </div>
    )
  }

  const productData = search?.productData

  return (
    <div className="results-container">

      {/* Product Analysis Card */}
      <div className="analysis-card">
        <h2>🧠 Product Identified</h2>

        <div className="product-grid">
          <div className="product-field">
            <span className="label">Product</span>
            <span className="value">{productData?.productName}</span>
          </div>
          <div className="product-field">
            <span className="label">Category</span>
            <span className="value">{productData?.category}</span>
          </div>
          <div className="product-field">
            <span className="label">Brand</span>
            <span className="value">{productData?.brand}</span>
          </div>
          <div className="product-field">
            <span className="label">Color</span>
            <span className="value">{productData?.color}</span>
          </div>
          <div className="product-field">
            <span className="label">Material</span>
            <span className="value">{productData?.material}</span>
          </div>
          <div className="product-field">
            <span className="label">Est. Price</span>
            <span className="value">{productData?.estimatedPriceRange}</span>
          </div>
        </div>

        {/* Key features */}
        {productData?.keyFeatures?.length > 0 && (
          <div className="features">
            <span className="label">Key Features</span>
            <div className="tags">
              {productData.keyFeatures.map((f, i) => (
                <span key={i} className="tag">{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Search query Gemini built */}
        <div className="search-query">
          <span className="label">🔍 Searching for</span>
          <span className="query-text">"{productData?.searchQuery}"</span>
        </div>

        {/* Uploaded image */}
        {search?.imageUrl && (
          <img
            src={search.imageUrl}
            alt="Uploaded product"
            className="uploaded-image"
          />
        )}
      </div>

      <div className="coming-soon">
        <h3>⏳ Phase 4 coming next!</h3>
        <p>We'll now search Amazon, Flipkart & more using this query and rank the best deals for you.</p>
      </div>

    </div>
  )
}

export default Results