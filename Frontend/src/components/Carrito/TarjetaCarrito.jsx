import './TarjetaCarrito.css';
import { useState } from 'react';
import { SUPERFICIES, FORMATOS } from '../../utils/opcionesCancha';
import { formatearMoneda } from '../../utils/moneda';

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export const TarjetaCarrito = ({ item, onQuitar, onCambiarCantidad }) => {
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(item.cantidad ?? 1);

    const aumentarCantidad = () => {
        if (cantidadSeleccionada < item.lugaresDisponibles) {
            const nueva = cantidadSeleccionada + 1;
            setCantidadSeleccionada(nueva);
            onCambiarCantidad?.(item.idItem, nueva);
        }
    };

    const sacarCantidad = () => {
        if (cantidadSeleccionada > 1) {
            const nueva = cantidadSeleccionada - 1;
            setCantidadSeleccionada(nueva);
            onCambiarCantidad?.(item.idItem, nueva);
        }
    };

    const tipoFutbol = FORMATOS.find((f) => f.valor === item.tipoFutbol);
    const tipoSuperficie = SUPERFICIES.find((s) => s.valor === item.tipoSuperficie);

    const fecha = item.fechaHora ? new Date(item.fechaHora) : null;
    const dia = fecha
        ? capitalizar(fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }))
        : null;
    const hora = fecha
        ? fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
        : null;

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
                    <h3 className="tarjeta-carrito__nombre">{item.nombreCancha}</h3>
                    <button
                        className="tarjeta-carrito__eliminar"
                        onClick={() => onQuitar(item.idItem)}
                        aria-label="Quitar del carrito"
                    >
                        🗑
                    </button>
                </div>

                <p className="tarjeta-carrito__ubicacion">{item.localidad} - {item.direccion}</p>

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
                        <span className="precio-turno__final">{formatearMoneda(item.subtotal)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};