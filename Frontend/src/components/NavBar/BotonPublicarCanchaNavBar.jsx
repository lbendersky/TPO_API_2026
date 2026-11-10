import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { Boton } from '../Boton/Boton';

export const BotonPublicarCanchaNavBar = () => {
    const navigate = useNavigate();
    const { estaLogueado } = useSelector((state) => state.usuarios);

    const handleClick = () => {
        navigate(estaLogueado ? '/publicar-cancha' : '/login');
    };

    return (
        <Boton variante="primario" tamaño="grande" onClick={handleClick}>
            <PlusCircle className="boton-publicar__icono" />
            <span>Publicá tu cancha</span>
        </Boton>
    );
};

export default BotonPublicarCanchaNavBar;