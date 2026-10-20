import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Moderar.css';

const Moderar = () => {
    const { usuario, estaLogueado } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
            return;
        }
        if (usuario && usuario.rol !== 'ADMIN') {
            navigate('/');
        }
    }, [estaLogueado, usuario, navigate]);

    if (!usuario || usuario.rol !== 'ADMIN') return null;

    return (
        <main className="moderar">
            <h1 className="moderar__titulo">Panel de moderación</h1>
        </main>
    );
};

export default Moderar;
