// import {Routes,Route} from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import Results from './pages/Results'
// import Compare from './pages/Compare'      
// import History from './pages/History'  

// function App() {
//   return (
//     <div className="app">
//       <Routes>
//         <Route path='/' element={<Home/>}/>
//         <Route path="/results/:searchId" element={<Results />} />
//         <Route path="/compare/:searchId" element={<Compare />} />
//         <Route path="/history" element={<History />} />
//       </Routes>
//     </div>
//   )
// }

// export default App

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Results from './pages/Results'
import Compare from './pages/Compare'
import History from './pages/History'

function App() {
  return (
    <div className="app" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/:searchId" element={<Results />} />
        <Route path="/compare/:searchId" element={<Compare />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  )
}

export default App