import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../context/useAuth";

import { HeaderCarrito } from "../../Components/Carrito/Header/HeaderCarrito";
import AvisoPrioridadBloqueada from "../../Components/Carrito/Header/AvisoPrioridadBloqueada";
import { TarjetaCarrito } from "../../Components/Carrito/Tarjetas/TarjetaCarrito";
import { CanchasSeleccionadas } from "../../Components/Carrito/CanchasSeleccionadas";
import { ResumenDeCompraCarrito } from "../../Components/Carrito/SideBar/ResumenDeCompraCarrito";
import { BotonConfirmarReserva } from "../../Components/Carrito/SideBar/BotonConfirmarReserva";

import "./Carrito.css";
import "../../Components/Carrito/Header/CarritoHeader.css";
import "../../Components/Carrito//SideBar/SideBar.css";
import "../../Components/Carrito/Tarjetas/TarjetaCarrito.css";

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
                        />
                    ))}
                </section>

                <aside className="carrito-sidebar">
                    <ResumenDeCompraCarrito total={carrito.total} items={items} />
                    <BotonConfirmarReserva onConfirmarReserva={onConfirmarReserva} />
                </aside>
            </div>
        </main>
    );
};

export default Carrito;