import './TarjetaCarrito.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SUPERFICIES, FORMATOS } from '../../utils/opcionesCancha';
import { formatearMoneda } from '../../utils/moneda';
import { quitarItemCarrito, actualizarCantidad, fetchCarrito } from '../../redux/carritoSlice';

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export const TarjetaCarrito = ({ item }) => {
    const dispatch = useDispatch();

    const idItemReal = item.idItem ?? item.id_item ?? item.id;
    const maxLugares = item.lugaresDisponibles 
        ?? item.turno?.lugaresDisponibles 
        ?? item.turno?.lugares_disponibles 
        ?? 10;

    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(item.cantidad ?? 1);

    useEffect(() => {
        if (item.cantidad !== undefined) {
            setCantidadSeleccionada(item.cantidad);
        }
    }, [item.cantidad]);

    const aumentarCantidad = async () => {
        if (cantidadSeleccionada < maxLugares) {
            const nueva = cantidadSeleccionada + 1;
            setCantidadSeleccionada(nueva);
            await dispatch(actualizarCantidad({ idItem: idItemReal, cantidad: nueva }));
        }
    };

    const sacarCantidad = async () => {
        if (cantidadSeleccionada > 1) {
            const nueva = cantidadSeleccionada - 1;
            setCantidadSeleccionada(nueva);
            await dispatch(actualizarCantidad({ idItem: idItemReal, cantidad: nueva }));
        }
    };

    const handleQuitar = async () => {
        await dispatch(quitarItemCarrito(idItemReal));
    };

    const tipoFutbol = FORMATOS.find((f) => f.valor === (item.tipoFutbol ?? item.turno?.tipoFutbol));
    const tipoSuperficie = SUPERFICIES.find((s) => s.valor === (item.tipoSuperficie ?? item.cancha?.tipoSuperficie));

    const fechaHoraRaw = item.fechaHora ?? item.turno?.fechaHora;
    const fecha = fechaHoraRaw ? new Date(fechaHoraRaw) : null;
    const dia = fecha
        ? capitalizar(fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }))
        : null;
    const hora = fecha
        ? fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
        : null;

    const precioUnitario = Number(
        item.precioUnitario ?? 
        item.precio_unitario ?? 
        item.turno?.precioPorJugador ?? 
        item.turno?.precio_por_jugador ?? 
        item.precio ?? 
        0
    );
    const subtotalMostrar = item.subtotal ?? item.subTotal ?? (precioUnitario * cantidadSeleccionada);

    return (
        <article className="tarjeta-carrito">
            <div className="tarjeta-carrito__imagen">
                <img
                    className="tarjeta-carrito__img"
                    src={item.imagen ? `data:image/png;base64,${item.imagen}` : null}
                    alt="Imagen de la cancha"
                />
                <span className="tarjeta-carrito__tipo-futbol">{tipoFutbol?.texto ?? item.tipoFutbol}</span>
            </div>

            <div className="tarjeta-carrito__cuerpo">
                <div className="tarjeta-carrito__encabezado">
                    <h3 className="tarjeta-carrito__nombre">{item.nombreCancha ?? item.cancha?.nombre}</h3>
                    <button
                        className="tarjeta-carrito__eliminar"
                        onClick={handleQuitar}
                        aria-label="Quitar del carrito"
                    >
                        🗑
                    </button>
                </div>

                <p className="tarjeta-carrito__ubicacion">
                    {item.localidad ?? item.cancha?.localidad?.nombre} {item.direccion ?? item.cancha?.direccion}
                </p>

                <div className="tarjeta-carrito__chips">
                    {fecha && (
                        <>
                            <span className="chip">{dia}</span>
                            <span className="chip chip--hora">{hora} hs</span>
                        </>
                    )}
                    <span className="chip chip--tipo">{tipoSuperficie?.texto ?? item.tipoSuperficie}</span>
                </div>

                <div className="tarjeta-carrito__pie">
                    <div className="turnos-control">
                        <span className="turnos-control__etiqueta">Turnos:</span>
                        <div className="turnos-control__selector">
                            <button type="button" className="boton-turno" onClick={sacarCantidad}>−</button>
                            <span className="turnos-control__cantidad">{cantidadSeleccionada}</span>
                            <button type="button" className="boton-turno" onClick={aumentarCantidad}>+</button>
                        </div>
                        <span className="estado-congelado">Congelado</span>
                    </div>

                    <div className="precio-turno">
                        <span className="precio-turno__final">{formatearMoneda(subtotalMostrar)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};