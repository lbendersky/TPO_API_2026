import {useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchFotosPrecargadas} from "../../redux/canchasSlice";

const SelectorFotos = ({ elegidas, onCambiar }) => {
    const dispatch = useDispatch();
    const precargadas = useSelector((state) => state.canchas.precargadas);

    useEffect(() => {
        if (precargadas.length === 0) dispatch(fetchFotosPrecargadas());
    }, [dispatch, precargadas.length]);

    const toggleFoto = (id) => {
        if (elegidas.includes(id)) onCambiar(elegidas.filter((f) => f !== id));
        else onCambiar([...elegidas, id]);
    };

    return (
        <div className="form-cancha__completo">
            <p>Foto de la cancha</p>
            <div className="form-cancha__fotos">
                {precargadas.map((img) => (
                    <img
                        key={img.id}
                        src={`data:image/png;base64,${img.file}`}
                        alt={img.nombre}
                        title={img.nombre}
                        onClick={() => toggleFoto(img.id)}
                        className={`form-cancha__foto ${elegidas.includes(img.id) ? 'form-cancha__foto--elegida' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SelectorFotos;