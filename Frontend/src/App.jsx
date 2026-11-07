import './App.css';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Inicio from './views/Inicio/Inicio'
import Carrito from './views/Carrito/Carrito';
import Turno from './views/Turno/Turno';
import Login from './views/Login/Login';
import Perfil from './views/Perfil/Perfil';
import PublicarCancha from './views/PublicarCancha/PublicarCancha'; 
import MisCanchas from './views/MisCanchas/MisCanchas';
import Moderar from './views/Moderar/Moderar';
import Checkout from './views/Checkout/Checkout'
import MisInscripciones from './views/MisInscripciones/MisInscripciones';
import QuienesSomos from './views/QuienesSomos/QuienesSomos';
import Contacto from './views/Contacto/Contacto';
import TerminosYCondiciones from './views/TerminosYCondiciones/TerminosYCondiciones';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusquedaProvider } from './context/BusquedaContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
    return (
        <AuthProvider>
            <BusquedaProvider>
                <ScrollToTop/>
                <NavBar/>
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/inicio" element={<Inicio />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="/turno/:id" element={<Turno />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/publicar-cancha" element={<PublicarCancha />} />
                        <Route path="/mis-canchas" element={<MisCanchas />} />
                        <Route path="/moderar" element={<Moderar />} />
                        <Route path="/carrito/checkout" element={<Checkout/>} />
                        <Route path="/mis-inscripciones" element={<MisInscripciones/>} />
                        <Route path="/quienes-somos" element={<QuienesSomos/>} />
                        <Route path="/contacto" element={<Contacto/>} />
                        <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones/>} />
                    </Routes>
                </main>
                <Footer/>
            </BusquedaProvider>
        </AuthProvider>
    );
}

export default App;