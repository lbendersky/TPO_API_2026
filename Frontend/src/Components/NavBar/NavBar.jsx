import Carrito from "./Carrito"
import MenuDesplegable from "./MenuDesplegable"
import Buscador from "./Buscador"

function NavBar() {
    return (
        <>
            <MenuDesplegable />
            <Buscador />
            <Carrito />
        </>
    )
}

export default NavBar