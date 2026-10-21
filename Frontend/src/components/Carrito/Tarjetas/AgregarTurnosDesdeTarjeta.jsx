import { useState } from 'react'
import { BotonAgregarTurno } from './BotonAgregarTurno'
import { BotonSacarTurno } from './BotonSacarTurno'

export const AgregarTurnosDesdeTarjeta = ({ cantidad, lugaresDisponibles, onCambiar }) => {
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(cantidad ?? 1)

  const aumentarCantidad = () => {
    if (cantidadSeleccionada < lugaresDisponibles) {
      const nueva = cantidadSeleccionada + 1
      setCantidadSeleccionada(nueva)
      onCambiar?.(nueva)
    }
  }

  const sacarCantidad = () => {
    if (cantidadSeleccionada > 1) {
      const nueva = cantidadSeleccionada - 1
      setCantidadSeleccionada(nueva)
      onCambiar?.(nueva)
    }
  }

  return (
    <div className="turnos-control">
      <span className="turnos-control__etiqueta">Turnos:</span>

      <div className="turnos-control__selector">
        <BotonSacarTurno onDecrecer={sacarCantidad} />
        <span className="turnos-control__cantidad">{cantidadSeleccionada}</span>
        <BotonAgregarTurno onAumentar={aumentarCantidad} />
      </div>

      <span className="estado-congelado">Congelado</span>
    </div>
  )
}