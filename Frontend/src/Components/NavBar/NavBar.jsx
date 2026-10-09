import Carrito from "./Carrito"
import MenuDesplegable from "./MenuDesplegable"
import Buscador from "./Buscador"
import Logo from "./Logo"
import Titulo from "./Titulo"
import "./NavBar.css"

function NavBar() {
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
                        <MenuDesplegable />
                        <Carrito />
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default NavBar