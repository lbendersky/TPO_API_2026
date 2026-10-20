import './App.css';
import NavBar from './Components/NavBar/NavBar';
import Inicio from './views/Inicio/Inicio'
import Carrito from './views/Carrito/Carrito';
import Turno from './views/Turno/Turno';
import Login from './views/Login/Login';
import Perfil from './views/Perfil/Perfil';
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
                    <Route path="/perfil" element={<Perfil />} />
                </Routes>
            </BusquedaProvider>
        </AuthProvider>
    );
}

export default App;