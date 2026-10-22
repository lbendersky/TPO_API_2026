import './Inicio.css';

import TurnoList from '../../components/TurnoList/TurnoList';

const Inicio = () => {
    return (
        <>
            <main className="inicio">
                <div className="inicio__hero">
                    <div className="inicio__hero-glow" aria-hidden="true"></div>
                    <img src="/inicio.png" alt="Sumate" className="inicio__img"/>
                </div>
                <div className="inicio__separador" aria-hidden="true">
                    <span className="inicio__separador-linea"></span>
                    <span className="inicio__separador-bola"></span>
                    <span className="inicio__separador-linea"></span>
                </div>
                <TurnoList />
            </main>
        </>
    );
};

export default Inicio;
