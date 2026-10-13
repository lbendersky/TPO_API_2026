import './App.css';
import NavBar from './components/NavBar/NavBar';
import Inicio from './views/Inicio'
import Carrito from './views/Carrito';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <>
        <NavBar/>
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/carrito" element={<Carrito />} />
        </Routes>
        </>
    );
}

export default App;