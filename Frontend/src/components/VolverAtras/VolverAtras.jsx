import './VolverAtras.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const VolverAtras = () => {
    const navigate = useNavigate();

    return (
        <button type="button" className="volver-atras" onClick={() => navigate(-1)}>
            <ArrowLeft />
            <span>Volver</span>
        </button>
    );
};

export default VolverAtras;