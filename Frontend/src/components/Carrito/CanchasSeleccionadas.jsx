import { useSelector } from 'react-redux';

export const CanchasSeleccionadas = () => {
    const items = useSelector((state) => state.carrito?.items) || [];
    const cantidad = items.length;

    return (
        <div className="canchas-seleccionadas">
            <h2 className="canchas-seleccionadas__titulo">
                Canchas seleccionadas
                <p>{cantidad}</p>
            </h2>
        </div>
    );
};