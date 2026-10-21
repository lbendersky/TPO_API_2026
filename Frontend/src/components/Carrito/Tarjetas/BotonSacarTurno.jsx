import React from 'react'

export const BotonSacarTurno = ({ onDecrecer }) => {
  return (
    <button
      type="button"
      className="boton-turno"
      onClick={onDecrecer}
    >
      −
    </button>
  )
}
