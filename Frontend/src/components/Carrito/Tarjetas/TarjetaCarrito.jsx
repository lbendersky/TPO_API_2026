import React from 'react'
import { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'
import { NombreDeLaCanchaTarjeta } from './NombreDeLaCanchaTarjeta'

import { formatearFechaHora } from "../../../utils/fecha";

export const TarjetaCarrito = ({ item }) => {
  const [turno, setTurno] = useState([]);
  const [cancha, setCancha] = useState([]);
  const [imgcancha, setImgcancha] = useState(null);

  useEffect(() => {
    fetch('${API_URL}/turnos/${item.idTurno}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setTurno(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])

  useEffect(() => {
    fetch('${API_URL}/canchas/${turno.idCancha}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setCancha(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])

  useEffect(() => {
    fetch('${API_URL}/imagenes/cancha/${turno.idCancha}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setimgcancha(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])

  const fechaHora = formatearFechaHora(turno.fechaHora);
  
  return (
  <article className="tarjeta-carrito">
    <ImagenTarjetaCarrito
      imagen={`data:image/png;base64,${imgcancha.file}`}
      tipoCancha={turno.tipoFutbol}
    />

    <div className="tarjeta-carrito__cuerpo">
      <div className="tarjeta-carrito__encabezado">
        <NombreDeLaCanchaTarjeta nombre={item.nombreCancha} />
        <button
          className="tarjeta-carrito__eliminar"
          onClick={onEliminar}
          aria-label="Quitar del carrito"
        >
          🗑
        </button>
      </div>

      <LocalizacionDeLaCanchaTarjeta localizacion={cancha.localidad} direccion={cancha.direccion}/>

      <FechaHoraTipoDeCanchaTarjeta
        fechaHora={fechaHora}
        tipoCancha={cancha.tipoSuperficie}
      />

      <div className="tarjeta-carrito__pie">
        <AgregarTurnosDesdeTarjeta
          cantidad={item.cantidad}
          lugaresDisponibles={turno.lugaresDisponibles}
        />
        <PrecioDelTurno precioConDescuento={item.subtotal} />
      </div>
    </div>
  </article>
)
}
