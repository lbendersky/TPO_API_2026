import {BotonCarritoNavBar} from "./BotonCarritoNavBar"
import {BotonUsuarioNavBar} from "./BotonUsuarioNavbar"
import {BotonPublicarCanchaNavBar} from "./BotonPublicarCanchaNavBar"
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
                    <ul>
                        <BotonPublicarCanchaNavBar />
                        <BotonCarritoNavBar irACarrito={irACarrito}/>
                    </ul>
                    <ul>
                        <BotonUsuarioNavBar/>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default NavBar