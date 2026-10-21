import React from 'react'
import { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'
import { NombreDeLaCanchaTarjeta } from './NombreDeLaCanchaTarjeta'
import { LocalizacionDeLaCanchaTarjeta } from './LocalizacionDeLaCanchaTarjeta'
import { FechaHoraTipoDeCanchaTarjeta } from './FechaHoraTipoDeCanchaTarjeta'
import { AgregarTurnosDesdeTarjeta } from './AgregarTurnosDesdeTarjeta'
import { PrecioDelTurno } from './PrecioDelTurno'

export const TarjetaCarrito = ({ item, onQuitar, onCambiarCantidad }) => {
  const [turno, setTurno] = useState({});
  const [cancha, setCancha] = useState({});
  const [imgcancha, setImgcancha] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/turnos/${item.idTurno}`)
      .then((response) => response.json())
      .then((data) => setTurno(data))
      .catch((error) => console.error("Error al cargar el turno del carrito:", error));
  }, [item.idTurno])

  useEffect(() => {
    if (!turno.idCancha) return;
    fetch(`${API_URL}/canchas/${turno.idCancha}`)
      .then((response) => response.json())
      .then((data) => setCancha(data))
      .catch((error) => console.error("Error al cargar la cancha del carrito:", error));
  }, [turno.idCancha])

  useEffect(() => {
    if (!turno.idCancha) return;
    fetch(`${API_URL}/imagenes/cancha/${turno.idCancha}`)
      .then((response) => response.json())
      .then((data) => setImgcancha(data[0] ?? null))
      .catch((error) => console.error("Error al cargar la imagen del carrito:", error));
  }, [turno.idCancha])

  return (
  <article className="tarjeta-carrito">
    <ImagenTarjetaCarrito
      imagen={imgcancha ? `data:image/png;base64,${imgcancha.file}` : null}
      tipoCancha={turno.tipoFutbol}
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

      <LocalizacionDeLaCanchaTarjeta localizacion={cancha.localidad} direccion={cancha.direccion}/>

      <FechaHoraTipoDeCanchaTarjeta
        fechaHora={turno.fechaHora}
        tipoSuperficie={cancha.tipoSuperficie}
      />

      <div className="tarjeta-carrito__pie">
        <AgregarTurnosDesdeTarjeta
          cantidad={item.cantidad}
          lugaresDisponibles={turno.lugaresDisponibles}
          onCambiar={(nuevaCantidad) => onCambiarCantidad(item.idItem, nuevaCantidad)}
        />
        <PrecioDelTurno precioConDescuento={item.subtotal} />
      </div>
    </div>
  </article>
  )
}