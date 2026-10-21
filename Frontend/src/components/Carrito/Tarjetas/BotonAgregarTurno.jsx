import React from 'react'

export const BotonAgregarTurno = ({ onAumentar }) => {
  return (
    <button
      type="button"
      className="boton-turno"
      onClick={onAumentar}
    >
      +
    </button>
  )
}
