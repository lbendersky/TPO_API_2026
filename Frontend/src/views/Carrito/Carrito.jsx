import { useEffect, useState } from "react";
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

const Carrito = () => {
    const [carrito, setCarrito] = useState({ items: [], total: 0 });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("Tenés que iniciar sesión para ver tu carrito.");
            setCargando(false);
            return;
        }

        fetch(`${API_URL}/carrito`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Respuesta inválida del servidor");
                return response.json();
            })
            .then((data) => {
                setCarrito(data);
            })
            .catch((error) => {
                console.error("Error al cargar el carrito:", error);
                setError("No se pudo cargar el carrito.");
            })
            .finally(() => setCargando(false));
    }, [token]);

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
                    <CanchasSeleccionadas cantidad={items.length} />

                    {cargando && <p className="carrito-mensaje">Cargando carrito...</p>}

                    {error && (
                        <p className="carrito-mensaje carrito-mensaje--error">{error}</p>
                    )}

                    {!cargando && !error && items.length === 0 && (
                        <p className="carrito-mensaje">Tu carrito está vacío.</p>
                    )}

                    {!cargando && !error && items.map((item) => (
                        <TarjetaCarrito
                            key={item.idItem}
                            item={item}
                            onQuitar={quitarItem}
                            onCambiarCantidad={actualizarCantidad}
                        />
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