import React from 'react'

import { SUPERFICIES } from '../../../utils/opcionesCancha'

export const TipoDeCanchaTarjetaCarrito = ({ tipoCancha }) => {
  const encontrado = SUPERFICIES.find((s) => s.valor === tipoCancha)

  return <span className="chip chip--tipo">{encontrado?.texto ?? tipoCancha}</span>
}