import React from 'react'

import { FORMATOS } from '../../../utils/opcionesCancha'

export const TipoFutbolTarjeta = ({ tipoCancha }) => {
  const texto = FORMATOS.find((f) => f.valor === tipoCancha)

  return <span className="tarjeta-carrito__tipo-futbol">{texto}</span>
}
