import Carrito from "./Carrito"
import MenuDesplegable from "./MenuDesplegable"
import Buscador from "./Buscador"

function NavBar() {
    return (
        <>
            <header>
                <nav>
                    <ul>
                        <MenuDesplegable />    
                        <Buscador />    
                        <Carrito />    
                    </ul>
                </nav>
            </header>
            <hr />
        </>
    )
}

export default NavBar