import './MisCanchas.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/useAuth';
import { fetchMisCanchas } from '../../redux/canchasSlice';
import { fetchMisTurnos } from '../../redux/turnosSlice';
import CanchaPropia from '../../components/CanchaPropia/CanchaPropia';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import { Boton } from '../../components/Boton/Boton';

const MisCanchas = () => {
    const { estaLogueado, usuario } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { misCanchas, loading, error } = useSelector((state) => state.canchas);

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        if (!usuario) return;
        dispatch(fetchMisCanchas(usuario.idUsuario));
        dispatch(fetchMisTurnos(usuario.idUsuario));
    }, [usuario, dispatch]);

    return (
        <main className="mis-canchas">
            <VolverAtras/>
            <div className="mis-canchas__header">
                <h1 className="mis-canchas__titulo">Mis canchas</h1>
                <Boton variante="acento" tamaño="grande" onClick={() => navigate('/publicar-cancha')}>
                    + Publicar nueva cancha
                </Boton>
            </div>

            {loading && misCanchas.length === 0 && <p className="mis-canchas__aviso">Cargando tus canchas...</p>}
            {error && <p className="mis-canchas__aviso">No se pudieron cargar tus canchas.</p>}
            {!loading && !error && misCanchas.length === 0 && (
                <p className="mis-canchas__aviso">Todavía no publicaste ninguna cancha.</p>
            )}

            <section className="mis-canchas__lista">
                {misCanchas.map((cancha) => (
                    <CanchaPropia key={cancha.idCancha} cancha={cancha} />
                ))}
            </section>
        </main>
    );
};

export default MisCanchas;