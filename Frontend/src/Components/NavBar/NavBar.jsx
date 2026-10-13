import CarritoNavBar from "./CarritoNavBar"
import Buscador from "./Buscador"
import Logo from "./Logo"
import Titulo from "./Titulo"
import "./NavBar.css"
import { useNavigate } from 'react-router-dom';

const NavBar = () =>{
    const navigate = useNavigate();

    const irACarrito = () => {
        navigate('/carrito');
    };


    return (
        <>
            <header>
                <nav className="navbar">
                    <a href="/Inicio"  className="titulo">
                        <Logo />
                        <Titulo />
                    </a>
                    <div className="buscador">
                        <Buscador />
                    </div>
                    <ul>
                        <button onClick={irACarrito}>
                            <CarritoNavBar/>    
                        </button>
                        
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default NavBar