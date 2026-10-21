import React from 'react'
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'
import { NombreDeLaCanchaTarjeta } from './NombreDeLaCanchaTarjeta'
import { LocalizacionDeLaCanchaTarjeta } from './LocalizacionDeLaCanchaTarjeta'
import { FechaHoraTipoDeCanchaTarjeta } from './FechaHoraTipoDeCanchaTarjeta'
import { AgregarTurnosDesdeTarjeta } from './AgregarTurnosDesdeTarjeta'
import { PrecioDelTurno } from './PrecioDelTurno'

export const TarjetaCarrito = ({ item, onQuitar, onCambiarCantidad }) => {
  return (
    <article className="tarjeta-carrito">
      <ImagenTarjetaCarrito
        imagen={item.imagen ? `data:image/png;base64,${item.imagen}` : null}
        tipoCancha={item.tipoFutbol}
      />

      <div className="tarjeta-carrito__cuerpo">
        <div className="tarjeta-carrito__encabezado">
          <NombreDeLaCanchaTarjeta nombre={item.nombreCancha} />
          <button
            className="tarjeta-carrito__eliminar"
            onClick={() => onQuitar(item.idItem)}
            aria-label="Quitar del carrito"
          >
            🗑
          </button>
        </div>

        <LocalizacionDeLaCanchaTarjeta localizacion={item.localidad} direccion={item.direccion} />

        <FechaHoraTipoDeCanchaTarjeta
          fechaHora={item.fechaHora}
          tipoSuperficie={item.tipoSuperficie}
        />

        <div className="tarjeta-carrito__pie">
          <AgregarTurnosDesdeTarjeta
            cantidad={item.cantidad}
            lugaresDisponibles={item.lugaresDisponibles}
            onCambiar={(nuevaCantidad) => onCambiarCantidad(item.idItem, nuevaCantidad)}
          />
          <PrecioDelTurno precioConDescuento={item.subtotal} />
        </div>
      </div>
    </article>
  )
}
