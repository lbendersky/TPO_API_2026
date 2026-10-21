
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

import { HeaderCarrito } from "../../Components/Carrito/HeaderCarrito";
import AvisoPrioridadBloqueada from "../../Components/Carrito/AvisoPrioridadBloqueada";
import { TarjetaCarrito } from "../../Components/Carrito/TarjetaCarrito";
import { CanchasSeleccionadas } from "../../Components/Carrito/CanchasSeleccionadas";
import { ResumenDeCompraCarrito } from "../../Components/Carrito/SideBar/ResumenDeCompraCarrito"
import { BotonConfirmarReserva } from "../../Components/Carrito/SideBar/BotonConfirmarReserva";
import { Navigate } from "react-router-dom";

const Carrito = () => {
    const [carrito, setCarrito] = useState({ items: [], total: 0 });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const { token } = useAuth();

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
    const navigate = useNavigate();

    const onConfirmarReserva = () => {
        Navigate('/carrito/checkout')
    }

    const items = carrito.items;

    return (
        <>
            <HeaderCarrito />
            <AvisoPrioridadBloqueada />

            <section>
                <CanchasSeleccionadas cantidad={items.length} />

                {cargando && <p>Cargando carrito...</p>}
                {error && <p>{error}</p>}

                {!cargando && !error && items.length === 0 && (
                    <p>Tu carrito está vacío.</p>
                )}

                {!cargando && !error && items.map((item) => (
                    <TarjetaCarrito
                        key={item.idItem}
                        item={item}
                    />
                ))}
            </section>
            <aside>
                <ResumenDeCompraCarrito total={carrito.total} items={items}/>
                <BotonConfirmarReserva onConfirmarReserva={onConfirmarReserva}/>
            </aside>
        </>
    );
};

export default Carrito;
