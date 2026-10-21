import React from 'react'

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1)

export const FechaTarjetaCarrito = ({ fecha }) => {
  const d = new Date(fecha)

  const dia = capitalizar(
    d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })
  )
  const hora = d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <>
      <span className="chip">{dia}</span>
      <span className="chip chip--hora">{hora} hs</span>
    </>
  )
}
