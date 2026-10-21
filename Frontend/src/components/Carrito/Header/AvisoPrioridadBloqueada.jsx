import { ContadorAvisoCarrito } from './ContadorAvisoCarrito';

const AvisoPrioridadBloqueada = () => {
  return (
    <div className="aviso-prioridad">
      <div className="aviso-prioridad__icono">🔒</div>

      <div className="aviso-prioridad__texto">
        <h4 className="aviso-prioridad__titulo">Prioridad bloqueada</h4>
        <p>
          Tus turnos se mantienen en el carrito mientras completás la compra.
          El precio queda congelado al momento de agregarlos.
        </p>
      </div>

      <ContadorAvisoCarrito />
    </div>
  )
}

export default AvisoPrioridadBloqueada
