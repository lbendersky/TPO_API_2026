export const CanchasSeleccionadas = ({ cantidad }) => {
    return (
        <div className="canchas-seleccionadas">
            <h2 className="canchas-seleccionadas__titulo">
                Canchas seleccionadas
                <p>{cantidad}</p>
            </h2>
        </div>
    );
};