import { useNavigate } from 'react-router-dom';
import UsuarioNavBar from "../Usuario/UsuarioNavBar"
import { useAuth } from "../../context/AuthContext"

export const BotonUsuarioNavBar = () => {
    const navigate = useNavigate();
    const { estaLogueado } = useAuth();

    const handleClick = () => {
        navigate(estaLogueado ? '/perfil' : '/login');
    };

    return (
        <button onClick={handleClick}>
            <UsuarioNavBar/>
        </button>
    )
}
