import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from "axios"
import {BrowserRouter} from 'react-router-dom'
import {AuthProvider} from './Context/AuthContext.jsx'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,)
