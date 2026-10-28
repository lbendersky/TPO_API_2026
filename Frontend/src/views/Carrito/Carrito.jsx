import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../context/useAuth";

import { HeaderCarrito } from "../../components/Carrito/Header/HeaderCarrito";
import AvisoPrioridadBloqueada from "../../components/Carrito/Header/AvisoPrioridadBloqueada";
import { TarjetaCarrito } from "../../components/Carrito/Tarjetas/TarjetaCarrito";
import { CanchasSeleccionadas } from "../../components/Carrito/CanchasSeleccionadas";
import { ResumenDeCompraCarrito } from "../../components/Carrito/SideBar/ResumenDeCompraCarrito";
import { BotonConfirmarReserva } from "../../components/Carrito/SideBar/BotonConfirmarReserva";

import "./Carrito.css";
import "../../components/Carrito/Header/CarritoHeader.css";
import "../../components/Carrito/SideBar/SideBar.css";
import "../../components/Carrito/Tarjetas/TarjetaCarrito.css";

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
    const [carrito, setCarrito] = useState({ items: [], total: 0 });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    const cargarCarrito = useCallback(() => {
        return fetch(`${API_URL}/carrito`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Respuesta inválida del servidor");
                return response.json();
            })
            .then((data) => setCarrito(data));
    }, [token]);

    useEffect(() => {
        if (!token) {
            setError("Tenés que iniciar sesión para ver tu carrito.");
            setCargando(false);
            return;
        }

        cargarCarrito()
            .catch((error) => {
                console.error("Error al cargar el carrito:", error);
                setError("No se pudo cargar el carrito.");
            })
            .finally(() => setCargando(false));
    }, [token, cargarCarrito]);

    const proximaExpiracion = useMemo(() => {
        const fechas = (carrito.items || [])
            .map((i) => i.fechaExpiracion)
            .filter(Boolean)
            .map((f) => new Date(f).getTime());
        return fechas.length ? Math.min(...fechas) : null;
    }, [carrito.items]);

    const yaRefrescadoRef = useRef(null);
    useEffect(() => {
        if (!proximaExpiracion) return;
        const msHastaVencer = proximaExpiracion - Date.now();
        if (msHastaVencer <= 0) return;
        const id = setTimeout(() => {
            if (yaRefrescadoRef.current === proximaExpiracion) return;
            yaRefrescadoRef.current = proximaExpiracion;
            cargarCarrito().catch(() => {});
        }, msHastaVencer + 500);
        return () => clearTimeout(id);
    }, [proximaExpiracion, cargarCarrito]);

    const onConfirmarReserva = () => {
        navigate("/carrito/checkout");
    };

    const quitarItem = (idItem) => {
        fetch(`${API_URL}/carrito/items/${idItem}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo quitar el turno del carrito.");
                return response.json();
            })
            .then((data) => setCarrito(data))
            .catch((error) => console.error("Error al quitar el item del carrito:", error));
    };

    const actualizarCantidad = (idItem, cantidad) => {
        fetch(`${API_URL}/carrito/items/${idItem}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cantidad }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo actualizar la cantidad.");
                return response.json();
            })
            .then((data) => setCarrito(data))
            .catch((error) => console.error("Error al actualizar la cantidad del carrito:", error));
    };

    const items = carrito.items;

    return (
        <main className="carrito-page">
            <HeaderCarrito />
            <AvisoPrioridadBloqueada />

            <div className="carrito-layout">
                <section className="carrito-principal">
                    <div className="carrito-principal__encabezado">
                        <CanchasSeleccionadas cantidad={items.length} />
                        {!cargando && !error && items.some((i) => i.fechaExpiracion) && (
                            <div className="carrito-principal__countdowns">
                                {items.map((item) => item.fechaExpiracion && (
                                    <CountdownItem key={item.idItem} fechaExpiracion={item.fechaExpiracion} />
                                ))}
                            </div>
                        )}
                    </div>

                    {cargando && <p className="carrito-mensaje">Cargando carrito...</p>}

                    {error && (
                        <p className="carrito-mensaje carrito-mensaje--error">{error}</p>
                    )}

                    {!cargando && !error && items.length === 0 && (
                        <p className="carrito-mensaje">Tu carrito está vacío.</p>
                    )}

                    {!cargando && !error && items.map((item) => (
                        <div key={item.idItem} className="carrito-item-con-contador">
                            <TarjetaCarrito
                                item={item}
                                onQuitar={quitarItem}
                                onCambiarCantidad={actualizarCantidad}
                            />
                        </div>
                    ))}
                </section>

                <aside className="carrito-sidebar">
                    <ResumenDeCompraCarrito total={carrito.total} items={items} />
                    <BotonConfirmarReserva onConfirmarReserva={onConfirmarReserva} disabled={items.length === 0} />
                </aside>
            </div>
        </main>
    );
};

export default Carrito;