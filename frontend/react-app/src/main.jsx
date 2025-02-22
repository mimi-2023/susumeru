import React from 'react'
import ReactDOM from 'react-dom/client'
import { Slide, ToastContainer } from 'react-toastify';
import App from './App.jsx'
import { SessionProvider } from './repositories/SessionProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar
        transition={Slide}
      />
    </SessionProvider>  
  </React.StrictMode>,
)
