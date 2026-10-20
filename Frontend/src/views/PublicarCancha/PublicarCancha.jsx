import './PublicarCancha.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import FormularioCancha from '../../components/FormularioCancha/FormularioCancha';

const PublicarCancha = () => {
    const { estaLogueado, token } = useAuth();
    const navigate = useNavigate();
    const [publicada, setPublicada] = useState(null);
    const [error, setError] = useState('');

    // Si no hay sesión, lo manda al login (igual que Perfil)
    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    const subirFoto = (idCancha, idImagenPrecargada) => {
        return fetch(`${API_URL}/imagenes/precargada`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ idCancha, idImagenPrecargada }),
        });
    };

    const subirFotos = (idCancha, idsImagenes) => {
        // Las manda una por una (podría ser en paralelo con Promise.all, pero así
        // si una falla no se cortan las demás)
        return idsImagenes.reduce(
            (promesa, id) => promesa.then(() => subirFoto(idCancha, id)),
            Promise.resolve()
        ).catch((err) => console.error('La cancha se publicó, pero fallaron algunas fotos', err));
    };

    const publicar = (datos, fotosElegidas) => {
        setError('');
        const cancha = {
            ...datos,
            idLocalidad: Number(datos.idLocalidad),
            precioUnitario: Number(datos.precioUnitario),
        };

        fetch(`${API_URL}/canchas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(cancha),
        })
            .then((response) => {
                if (!response.ok) throw new Error('No se pudo publicar la cancha');
                return response.json();
            })
            .then((data) => fotosElegidas.length > 0 ? subirFotos(data.idCancha, fotosElegidas).then(() => data) : data)
            .then((data) => setPublicada(data))
            .catch((err) => {
                console.error('Error al publicar la cancha', err);
                setError('No pudimos publicar tu cancha. Revisá los datos e intentá de nuevo.');
            });
    };

    return (
        <main className="publicar-cancha">
            <h1 className="publicar-cancha__titulo">Publicá tu cancha</h1>
            {publicada ? (
                <section className="publicar-cancha__exito">
                    <h2>¡Listo! "{publicada.nombre}" ya está publicada ⚽</h2>
                    <p>{publicada.localidad} - {publicada.tipoFutbol} - {publicada.cantidadJugadores} jugadores</p>
                    <button onClick={() => setPublicada(null)}>Publicar otra cancha</button>
                    <button onClick={() => navigate('/mis-canchas')}>Ver mis canchas</button>
                    <button onClick={() => navigate('/inicio')}>Volver al inicio</button>
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