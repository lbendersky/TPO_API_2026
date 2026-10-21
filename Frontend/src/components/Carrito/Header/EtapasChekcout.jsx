import { EtapaDelCheckout } from "./EtapaDelCheckout";
import { Fragment } from 'react';

const ETAPAS = ['Carrito', 'Confirmación']

export const EtapasCheckout = ({ etapaActual = 1 }) => {
  return (
    <nav className="etapas-checkout" aria-label="Pasos del checkout">
      {ETAPAS.map((nombre, i) => (
        <Fragment key={nombre}>
          <EtapaDelCheckout
            numero={i + 1}
            nombre={nombre}
            activa={i + 1 === etapaActual}
          />
          {i < ETAPAS.length - 1 && <span className="etapa__separador">›</span>}
        </Fragment>
      ))}
    </nav>
  )
}