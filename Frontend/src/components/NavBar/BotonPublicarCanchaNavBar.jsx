import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const BotonPublicarCanchaNavBar = () => {
    const navigate = useNavigate();
    const { estaLogueado } = useAuth();

    const handleClick = () => {
        navigate(estaLogueado ? '/publicar-cancha' : '/login');
    };

    return (
        <button className="boton-publicar" onClick={handleClick}>
            <PlusCircle className="boton-publicar__icono" />
            <span>Publicá tu cancha</span>
        </button>
    );
};

export default BotonPublicarCanchaNavBar;