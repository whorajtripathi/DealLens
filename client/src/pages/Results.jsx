import { useParams } from 'react-router-dom'

function Results() {
  const { searchId } = useParams()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Search received! 🎉</h2>
      <p>Search ID: <strong>{searchId}</strong></p>
      <p style={{ color: 'gray' }}>Results coming in Phase 3!</p>
    </div>
  )
}

export default Results