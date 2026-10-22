import './ParticipantesTurno.css';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { API_URL } from '../../config';

const ParticipantesTurno = ({ idTurno }) => {
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        if (!idTurno) return;
        fetch(`${API_URL}/turnos/${idTurno}/participantes`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then(setParticipantes)
            .catch((e) => console.error('Error al cargar participantes', e));
    }, [idTurno]);

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
