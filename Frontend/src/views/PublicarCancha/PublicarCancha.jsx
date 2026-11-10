import './PublicarCancha.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioCancha from '../../components/FormularioCancha/FormularioCancha';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import { Boton } from '../../components/Boton/Boton';
import {useDispatch, useSelector} from "react-redux";
import {publicarCancha, limpiarPublicada} from "../../redux/canchasSlice";

const PublicarCancha = () => {
    const { estaLogueado, token } = useSelector((state) => state.usuarios);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const publicada = useSelector((state) => state.canchas.ultimaPublicada);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        dispatch(limpiarPublicada());
    }, [dispatch]);

    const publicar = (form, fotosElegidas) => {
        setError('');
        const datos = { ...form, idLocalidad: Number(form.idLocalidad), precioUnitario: Number(form.precioUnitario) };
        dispatch(publicarCancha({ datos, fotos: fotosElegidas, token }))
            .unwrap()
            .catch(() => setError('No pudimos publicar tu cancha. Revisá los datos e intentá de nuevo.'));
    };


    return (
        <main className="publicar-cancha">
            <VolverAtras/>
            <h1 className="publicar-cancha__titulo">Publicá tu cancha</h1>
            {publicada ? (
                <section className="publicar-cancha__exito">
                    <h2>¡Listo! "{publicada.nombre}" ya está publicada ⚽</h2>
                    <p>{publicada.localidad} - {publicada.tipoFutbol} - {publicada.cantidadJugadores} jugadores</p>
                    <Boton variante="primario" onClick={() => dispatch(limpiarPublicada())}>Publicar otra cancha</Boton>
                    <Boton variante="primario" onClick={() => navigate('/mis-canchas')}>Ver mis canchas</Boton>
                    <Boton variante="primario" onClick={() => navigate('/inicio')}>Volver al inicio</Boton>
                </section>
            ) : (
                <>
                    <p className="publicar-cancha__subtitulo">Completá los datos y empezá a recibir jugadores.</p>
                    {error && <p className="publicar-cancha__error">{error}</p>}
                    <FormularioCancha onPublicar={publicar} />
                </>
            )}
        </main>
    );
};

export default PublicarCancha;