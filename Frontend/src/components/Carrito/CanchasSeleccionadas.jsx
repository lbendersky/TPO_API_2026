import React from 'react'
import { CantidadCanchasSeleccionadas } from "./CantidadCanchasSeleccionadas"

export const CanchasSeleccionadas = ({cantidad}) => {
  return (
    <div className="canchas-seleccionadas">
      <h2 className="canchas-seleccionadas__titulo">
        Canchas seleccionadas
        <CantidadCanchasSeleccionadas cantidad={cantidad}>
          {cantidad}
        </CantidadCanchasSeleccionadas>
      </h2>
    </div>
  )
}
