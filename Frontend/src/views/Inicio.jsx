import './Inicio.css';

import TurnoList from '../components/TurnoList';

const Inicio = () => {
    return (
        <>
            <main className="inicio">
                <img src="/inicio.png" alt="Sumate" className="inicio__img"/>
                <TurnoList />
            </main>
        </>
    );
};

export default Inicio;