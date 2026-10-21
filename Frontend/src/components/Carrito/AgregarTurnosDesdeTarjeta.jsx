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
    <>
        <p>Turnos</p>
        <div>
            <BotonSacarTurno
                onDecrecer={sacarCantidad}
            />
            <p>{cantidad}</p>
            <BotonAgregarTurno
                onAumentar={aumentarCantidad}
            />
        </div>
    </>
  )
}
