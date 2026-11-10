import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UsuarioNavBar from "../Usuario/UsuarioNavBar"

export const BotonUsuarioNavBar = () => {
    const navigate = useNavigate();
    const { estaLogueado } = useSelector((state) => state.usuarios);

    const handleClick = () => {
        navigate(estaLogueado ? '/perfil' : '/login');
    };

    return (
        <button onClick={handleClick}>
            <UsuarioNavBar/>
        </button>
    )
}
