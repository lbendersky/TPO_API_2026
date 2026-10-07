import './TurnoList.css';

import { useState } from 'react';
import TurnoCard from './TurnoCard';
 const TurnoList = () => {
    const [turnos, setTurnos] = useState([
    {
        idTurno: 1,
        fechaHora: 'Viernes 20:00',
        tipoFutbol: 'F5',
        lugaresDisponibles: 3,
        precioPorJugador: 3500,
        descripcion: 'Partido amistoso, nivel intermedio.',
        imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
        nombreCancha: 'La Bombonerita',
        localidad: 'Caballito',
        nombreOrganizador: 'Juan Perez',
        precioConDescuento: 3500,
        tieneOfertaActiva: false,
        estado: 'INCOMPLETO',
    },
    {
        idTurno: 2,
        fechaHora: 'Sabado 18:00',
        tipoFutbol: 'F7',
        lugaresDisponibles: 1,
        precioPorJugador: 4200,
        imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
        nombreCancha: 'El Potrero',
        localidad: 'Flores',
        nombreOrganizador: 'Martin Gomez',
        precioConDescuento: 3570,
        tieneOfertaActiva: true,
        estado: 'INCOMPLETO',
    },
    {
        idTurno: 3,
        fechaHora: 'Domingo 10:00',
        tipoFutbol: 'F11',
        lugaresDisponibles: 5,
        precioPorJugador: 5000,
        descripcion: 'Torneo interno, cancha de 11.',
        imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
        nombreCancha: 'Complejo Norte',
        localidad: 'Nuñez',
        nombreOrganizador: 'Lucas Fernandez',
        precioConDescuento: 5000,
        tieneOfertaActiva: false,
        estado: 'INCOMPLETO',
        },
    ]);
    return (
    <section className="turno-list">
        {turnos
        .filter((value) => value.estado === 'INCOMPLETO')
        .map((value) => (
            <TurnoCard
                key={value.idTurno}
                fechaHora={value.fechaHora}
                tipoFutbol={value.tipoFutbol}
                lugaresDisponibles={value.lugaresDisponibles}
                precioPorJugador={value.precioPorJugador}
                descripcion={value.descripcion}
                imagenPath={value.imagenPath}
                nombreCancha={value.nombreCancha}
                localidad={value.localidad}
                nombreOrganizador={value.nombreOrganizador}
                precioConDescuento={value.precioConDescuento}
                tieneOfertaActiva={value.tieneOfertaActiva}
                />
            ))}
        </section>
    );
};

export default TurnoList;