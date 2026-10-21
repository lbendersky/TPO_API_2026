import React from 'react'

export const BotonCheckout = ({ confirmarPago }) => {
  return (
    <button
      type="button"
      className="boton-confirmar-reserva"
      onClick={confirmarPago}
    >
        Confirmar pago
    </button>
  )
}
