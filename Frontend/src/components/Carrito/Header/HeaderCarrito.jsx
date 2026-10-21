import { EtapasCheckout } from "./EtapasChekcout";

export const HeaderCarrito = ({ etapaActual}) => {
  return (
    <header className="header-carrito">
      <div>
        <span className="header-carrito__etiqueta">Checkout de turnos</span>
        <h2 className="header-carrito__titulo">Carrito de compras</h2>
        <p className="header-carrito__subtitulo">
          Asegurá tu horario antes de que venza la prioridad de match
        </p>
      </div>

      <EtapasCheckout etapaActual={etapaActual} />
    </header>
  )
}