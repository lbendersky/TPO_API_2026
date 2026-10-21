import React from 'react'

export const BotonConfirmarReserva = ({
  onConfirmarReserva,
}) => {
  return (
    <button
      type="button"
      className="boton-confirmar-reserva"
      onClick={onConfirmarReserva}
    >
      Confirmar Reserva
    </button>
  )
}