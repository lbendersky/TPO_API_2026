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

    const publicar = (datos) => {
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