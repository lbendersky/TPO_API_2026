import { BotonCambioDeURL } from "./BotonCambioDeURL"
import { BotonPublicarCancha } from "./BotonPublicarCancha"
import { BuscadorNavBar } from "./BuscadorNavBar"
import Carrito from "./Carrito"
import { LogoNavBar } from "./LogoNavBar"
import { PerfilUsuarioNavBar } from "./PerfilUsuarioNavBar"

const NavBar = () =>{
    return (
        <nav className="flex items-center gap-6 bg-white px-6 py-3">
            <LogoNavBar />
            <BuscadorNavBar />

            <div className="flex items-center gap-6">
                <BotonCambioDeURL texto="Inscripciones" />
                <BotonCambioDeURL texto="Canchas" />
                <BotonCambioDeURL prefijo="Admin" texto="Ofertas" />
            </div>

            <div className="ml-auto flex items-center gap-4">
                <Carrito />
                <BotonPublicarCancha />
                <PerfilUsuarioNavBar />
            </div>
    </nav>
    )
}

export default NavBar