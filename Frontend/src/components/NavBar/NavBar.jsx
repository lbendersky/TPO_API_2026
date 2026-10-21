import {BotonCarritoNavBar} from "./BotonCarritoNavBar"
import {BotonUsuarioNavBar} from "./BotonUsuarioNavbar"
import {BotonPublicarCanchaNavBar} from "./BotonPublicarCanchaNavBar"
import Logo from "./Logo"
import Titulo from "./Titulo"
import "./NavBar.css"
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () =>{
    const navigate = useNavigate();

    const irACarrito = () => {
        navigate('/carrito');
    };


    return (
        <>
            <header>
                <nav className="navbar">
                    <Link to="/inicio" className="titulo">
                        <Logo />
                        <Titulo />
                    </Link>
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