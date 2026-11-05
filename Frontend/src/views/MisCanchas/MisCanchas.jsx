import './MisCanchas.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../config';
import CanchaPropia from '../../components/CanchaPropia/CanchaPropia';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import {useDispatch} from "react-redux";
import {fetchMisTurnos} from "../../redux/turnosSlice";

const MisCanchas = () => {
    const { estaLogueado, usuario } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        if (!usuario) return;
        dispatch(fetchMisTurnos(usuario.idUsuario)); //Pide los turnos de las canchas del usuario
        fetch(`${API_URL}/canchas/usuario/${usuario.idUsuario}`) //Fatla usar redux para esto 
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar tus canchas');
                return response.json();
            })
            .then((data) => {
                setCanchas(data);
                setCargando(false);
            })
            .catch((error) => {
                console.error('Error al cargar las canchas', error);
                setCargando(false);
            });
    }, [usuario, dispatch]);

    const actualizarCancha = (cambiada) => setCanchas(canchas.map((c) => (c.idCancha === cambiada.idCancha ? cambiada : c)));

    return (
        <main className="mis-canchas">
            <VolverAtras/>
            <div className="mis-canchas__header">
                <h1 className="mis-canchas__titulo">Mis canchas</h1>
                <button className="mis-canchas__nueva" onClick={() => navigate('/publicar-cancha')}>
                    + Publicar nueva cancha
                </button>
            </div>

            {cargando && <p className="mis-canchas__aviso">Cargando tus canchas...</p>}
            {!cargando && canchas.length === 0 && (
                <p className="mis-canchas__aviso">Todavía no publicaste ninguna cancha.</p>
            )}

            <section className="mis-canchas__lista">
                {canchas.map((cancha) => (
                    <CanchaPropia key={cancha.idCancha} cancha={cancha} onCambio={actualizarCancha} />
                ))}
            </section>
        </main>
    );
};

export default MisCanchas;