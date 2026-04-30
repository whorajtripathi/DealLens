// Home.jsx — The main upload page
// User can either upload an image OR type a description
// Then hit Search to submit it to the backend

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitSearch } from '../services/api'
import './Home.css'

function Home() {
  // activeTab controls which input mode is shown
  const [activeTab, setActiveTab] = useState('image') // 'image' or 'text'

  // selectedImage holds the actual File object for upload
  const [selectedImage, setSelectedImage] = useState(null)

  // preview is a temporary URL to show the image on screen
  const [preview, setPreview] = useState(null)

  // productText holds whatever user typed
  const [productText, setProductText] = useState('')

  // loading shows spinner while request is in progress
  const [loading, setLoading] = useState(false)

  // error shows if something goes wrong
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // Called when user picks an image file
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedImage(file)

    // URL.createObjectURL makes a temporary local URL
    // so we can show a preview without uploading yet
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  // Called when user drops an image on the drop zone
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file')
      return
    }
    setSelectedImage(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  // Called when user clicks Search button
  const handleSubmit = async () => {
    // Validation
    if (activeTab === 'image' && !selectedImage) {
      setError('Please select an image first')
      return
    }
    if (activeTab === 'text' && !productText.trim()) {
      setError('Please describe the product')
      return
    }

    setLoading(true)
    setError('')

    try {
      // FormData is used to send both files and text in one request
      // Regular JSON can't send files — FormData can
      const formData = new FormData()

      if (activeTab === 'image' && selectedImage) {
        formData.append('image', selectedImage)
      }

      if (productText.trim()) {
        formData.append('productText', productText)
      }

      const response = await submitSearch(formData)

      if (response.success) {
        // Navigate to results page with the searchId
        // Phase 4 will use this ID to fetch ranked results
        navigate(`/results/${response.searchId}`)
      }

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <div className="hero">
        <h1 className="logo">🔍 DealLens</h1>
        <p className="tagline">Upload a photo or describe a product — we find the best deals</p>
      </div>

      <div className="card">
        {/* Tab switcher */}
        <div className="tabs">
          <button
            className={activeTab === 'image' ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab('image'); setError('') }}
          >
            Upload Image
          </button>
          <button
            className={activeTab === 'text' ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab('text'); setError('') }}
          >
            Describe Product
          </button>
        </div>

        {/* Image upload tab */}
        {activeTab === 'image' && (
          <div
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <div className="dropzone-placeholder">
                <span className="upload-icon">📷</span>
                <p>Click to upload or drag and drop</p>
                <p className="hint">JPG, PNG, WEBP up to 5MB</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Text input tab */}
        {activeTab === 'text' && (
          <textarea
            className="text-input"
            placeholder="Describe the product you want...
Example: blue Nike running shoes, men's size 9, lightweight"
            value={productText}
            onChange={(e) => setProductText(e.target.value)}
            rows={6}
          />
        )}

        {/* Optional text for image tab */}
        {activeTab === 'image' && (
          <input
            type="text"
            className="extra-input"
            placeholder="Add details (optional): color, size, brand..."
            value={productText}
            onChange={(e) => setProductText(e.target.value)}
          />
        )}

        {/* Error message */}
        {error && <p className="error">{error}</p>}

        {/* Search button */}
        <button
          className="search-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Find Best Deals 🔍'}
        </button>
      </div>
    </div>
  )
}

export default Home