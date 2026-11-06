import './ParticipantesTurno.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { fetchParticipantes } from '../../redux/turnosSlice';

const ParticipantesTurno = ({ idTurno }) => {
    const dispatch = useDispatch();
    const participantes = useSelector((state) => state.turnos.participantesPorId[idTurno] ?? []);

    useEffect(() => {
        if (!idTurno) return;
        dispatch(fetchParticipantes(idTurno));
    }, [dispatch, idTurno]);

    const conteo = participantes.reduce((acc, nombre) => {
        acc.set(nombre, (acc.get(nombre) || 0) + 1);
        return acc;
    }, new Map());

    if (conteo.size === 0) return null;

    return (
        <aside className="participantes">
            <h3 className="participantes__titulo">Anotados</h3>
            <ul className="participantes__lista">
                {Array.from(conteo.entries()).map(([nombre, cantidad]) => (
                    <li key={nombre} className="participantes__item">
                        <User size={16} />
                        <span>{nombre}{cantidad > 1 ? ` (${cantidad})` : ''}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default ParticipantesTurno;