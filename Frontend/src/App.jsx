import './App.css';
import NavBar from './components/NavBar/NavBar';
import Inicio from './views/Inicio'
import Carrito from './views/Carrito';
import { Routes, Route } from 'react-router-dom';
// Importa el Provider del contexto de búsqueda para compartir el texto entre NavBar y TurnoList
import { BusquedaProvider } from './context/BusquedaContext';

function App() {
    return (
        // El Provider envuelve a toda la app para que cualquier componente adentro
        // (NavBar/Buscador y las vistas con TurnoList) pueda leer o modificar el texto de búsqueda
        <BusquedaProvider>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/carrito" element={<Carrito />} />
            </Routes>
        </BusquedaProvider>
    );
}

export default App;