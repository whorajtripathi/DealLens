// // // api.js — All API calls from React to Express live here
// // // Instead of writing fetch() everywhere, we centralize it here
// // // If backend URL changes, we only change it in ONE place

// // import axios from 'axios'

// // // Base URL of your Express server
// // const API = axios.create({
// //   baseURL: 'http://localhost:5000/api'
// // })

// // // Send image or text to backend for searching
// // export const submitSearch = async (formData) => {
// //   const response = await API.post('/search', formData, {
// //     headers: {
// //       'Content-Type': 'multipart/form-data'  // needed for file uploads
// //     }
// //   })
// //   return response.data
// // }

// // export const getSearchById = async (searchId) => {
// //   const response = await API.get(`/search/${searchId}`)
// //   return response.data
// // }

// //Deployement changes
// import axios from 'axios'

// const API = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// })

// export const submitSearch = async (formData) => {
//     const response = await API.post('/search', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })

//     return response.data
// }

// export const getSearchById = async (id) => {
//     const response = await API.get(`/search/${id}`)
//     return response.data
// }

import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const submitSearch = async (formData) => {
  const response = await API.post('/search', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const getSearchById = async (id) => {
  const response = await API.get(`/search/${id}`)
  return response.data
}

export default API