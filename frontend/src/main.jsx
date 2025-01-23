import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer ,toast} from 'react-toastify'
import axios from 'axios'


axios.interceptors.request.use((req)=>{
  if(sessionStorage.getItem('token')){
    req.headers.Authorization=`Bearer ${sessionStorage.getItem('token')}`
  }
  return req
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
    <App />
  </StrictMode>,
)
