import './App.css';
import NavBar from './components/NavBar/NavBar';
import Inicio from './views/Inicio/Inicio'
import Carrito from './views/Carrito';
import Turno from './views/Turno/Turno';
import Login from './views/Login/Login';
import { Routes, Route } from 'react-router-dom';
// Importa el Provider del contexto de búsqueda para compartir el texto entre NavBar y TurnoList
import { BusquedaProvider } from './context/BusquedaContext';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <BusquedaProvider>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/turno/:id" element={<Turno />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BusquedaProvider>
        </AuthProvider>
    );
}

export default App;