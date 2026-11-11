import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../config";
import VolverAtras from "../../components/VolverAtras/VolverAtras";

import { HeaderCarrito } from "../../components/Carrito/HeaderCarrito";
import { TarjetaCarrito } from "../../components/Carrito/TarjetaCarrito";
import { ResumenDeCompraCarrito } from "../../components/Carrito/ResumenDeCompraCarrito";

import "./Carrito.css";
import { fetchCarrito } from "../../redux/carritoSlice";

const formatearTiempoRestante = (ms) => {
    if (ms <= 0) return "00:00";
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
};

const CountdownItem = ({ fechaExpiracion }) => {
    const [restante, setRestante] = useState(() => new Date(fechaExpiracion).getTime() - Date.now());

    useEffect(() => {
        const objetivo = new Date(fechaExpiracion).getTime();
        setRestante(objetivo - Date.now());
        const id = setInterval(() => {
            setRestante(objetivo - Date.now());
        }, 1000);
        return () => clearInterval(id);
    }, [fechaExpiracion]);

    const vencido = restante <= 0;
    return (
        <div className={`carrito-countdown${vencido ? " carrito-countdown--vencido" : ""}`}>
            {vencido
                ? "Reserva expirada"
                : `Reserva vence en ${formatearTiempoRestante(restante)}`}
        </div>
    );
};

const Carrito = () => {
    const { token } = useSelector((state) => state.usuarios);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { items = [], error, loading } = useSelector((state) => state.carrito);
    const sinSesion = !token;

    useEffect(() => {
        if (sinSesion) return;
        dispatch(fetchCarrito());
    }, [sinSesion, dispatch]);

    const proximaExpiracion = useMemo(() => {
        if (!Array.isArray(items)) return null;
        const fechas = items
            .map((i) => i.fechaExpiracion)
            .filter(Boolean)
            .map((f) => new Date(f).getTime());
        return fechas.length ? Math.min(...fechas) : null;
    }, [items]);

    const yaRefrescadoRef = useRef(null);
    useEffect(() => {
        if (!proximaExpiracion) return;
        const msHastaVencer = proximaExpiracion - Date.now();
        if (msHastaVencer <= 0) return;
        const id = setTimeout(() => {
            if (yaRefrescadoRef.current === proximaExpiracion) return;
            yaRefrescadoRef.current = proximaExpiracion;
            dispatch(fetchCarrito());
        }, msHastaVencer + 500);
        return () => clearTimeout(id);
    }, [proximaExpiracion, dispatch]);

    const onConfirmarReserva = () => {
        navigate("/carrito/checkout");
    };

    const mostrarContenido = !sinSesion && !loading && !error;

    return (
        <main className="carrito-page">
            <HeaderCarrito />
            <VolverAtras />

            <div className="aviso-prioridad">
                <div className="aviso-prioridad__icono">🔒</div>
                <div className="aviso-prioridad__texto">
                    <h4 className="aviso-prioridad__titulo">Prioridad bloqueada</h4>
                    <p>
                        Tus turnos se mantienen en el carrito mientras completás la compra.
                        El precio queda congelado al momento de agregarlos.
                    </p>
                </div>
            </div>

            <div className="carrito-layout">
                <section className="carrito-principal">
                    <div className="carrito-principal__encabezado">
                        <div className="canchas-seleccionadas">
                            <h2 className="canchas-seleccionadas__titulo">
                                Canchas seleccionadas
                                <p>{items.length}</p>
                            </h2>
                        </div>
                        {mostrarContenido && proximaExpiracion && (
                            <div className="carrito-principal__countdowns">
                                <CountdownItem fechaExpiracion={proximaExpiracion} />
                            </div>
                        )}
                    </div>

                    {sinSesion && (
                        <p className="carrito-mensaje carrito-mensaje--error">
                            Tenés que iniciar sesión para ver tu carrito.
                        </p>
                    )}

                    {!sinSesion && loading && <p className="carrito-mensaje">Cargando carrito...</p>}

                    {!sinSesion && error && (
                        <p className="carrito-mensaje carrito-mensaje--error">{error}</p>
                    )}

                    {mostrarContenido && items.length === 0 && (
                        <p className="carrito-mensaje">Tu carrito está vacío.</p>
                    )}

                    {mostrarContenido && items.map((item) => (
                        <div key={item.idItem ?? item.id_item ?? item.id} className="carrito-item-con-contador">
                            <TarjetaCarrito item={item} />
                        </div>
                    ))}
                </section>

                <aside className="carrito-sidebar">
                    <ResumenDeCompraCarrito onConfirmarReserva={onConfirmarReserva} />
                </aside>
            </div>
        </main>
    );
};

export default Carrito;
