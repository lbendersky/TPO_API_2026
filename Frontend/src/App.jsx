import { useState } from 'react'
import './App.css'
import NavBar from "./Components/NavBar/NavBar"
import Tarjeta from "./Components/Tarjeta"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <section>
        <Tarjeta />
      </section>
    </>
  )
}

export default App
