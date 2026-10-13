import React from 'react'
import CarritoNavBar from "./CarritoNavBar"

export const BotonCarritoNavBar = ({ irACarrito }) => {
  return (
    <>
        <button onClick={irACarrito}>
            <CarritoNavBar/>
        </button>
    </>
  )
}
