import React from 'react'

export const BotonConfirmarReserva = ({ onConfirmarReserva, disabled = false }) => {
  return (
    <button
      type="button"
      className="boton-confirmar-reserva"
      onClick={onConfirmarReserva}
      disabled={disabled}
    >
      Confirmar Reserva
    </button>
  )
}