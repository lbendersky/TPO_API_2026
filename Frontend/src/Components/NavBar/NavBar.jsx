import CarritoNavBar from "./CarritoNavBar"
import Buscador from "./Buscador"
import Logo from "./Logo"
import Titulo from "./Titulo"
import "./NavBar.css"

const NavBar = () =>{
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
                        <CarritoNavBar />
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default NavBar