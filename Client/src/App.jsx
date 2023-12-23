import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import {Route, Routes} from "react-router-dom"
import Register from "./pages/Register/Register"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
