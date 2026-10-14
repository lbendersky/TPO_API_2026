// Hook custom del contexto de búsqueda: nos da el texto actual y el setter para modificarlo
import { useBusqueda } from '../../context/BusquedaContext';

function Buscador() {
    // Extrae del contexto el valor actual del texto y la función para actualizarlo.
    // Como está compartido, al escribir acá se re-renderiza TurnoList con el nuevo filtro.
    const { textoBusqueda, setTextoBusqueda } = useBusqueda();

    return (
        <div className="buscador">
            {/* Input controlado:
                - value viene del contexto (fuente única de verdad)
                - onChange actualiza el contexto en cada tecla => filtrado "in real time" */}
            <input
                type="text"
                placeholder="Podés escribir el nombre de la cancha acá..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                className="buscador__input"
            />
        </div>
    )
}

export default Buscador
