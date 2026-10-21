import { useState } from 'react'
import { BotonAgregarTurno } from './BotonAgregarTurno'
import { BotonSacarTurno } from './BotonSacarTurno'


export const AgregaraTurnosDesdeTarjeta = ({ cantidad, lugaresDisponibles }) => {
  const [cantidad, setCantidad] = useState(1)

  const aumentarCantidad = () => {
    if (cantidad < lugaresDisponibles)
        setCantidad(cantidad+1)
  }

  const sacarCantidad = () => {
    setCantidad(cantidad-1)
  }

  return (
    <div className="turnos-control">
      <span className="turnos-control__etiqueta">Turnos:</span>

      <div className="turnos-control__selector">
        <BotonSacarTurno onDecrecer={sacarCantidad} />
        <span className="turnos-control__cantidad">{cantidad}</span>
        <BotonAgregarTurno onAumentar={aumentarCantidad} />
      </div>

      <span className="estado-congelado">Congelado</span>
  </div>
  )
}
