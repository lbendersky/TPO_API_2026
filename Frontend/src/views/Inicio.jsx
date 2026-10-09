import './Inicio.css';

import NavBar from '../components/NavBar/NavBar';
import TurnoList from '../components/TurnoList';

const Inicio = () => {
    return (
        <>
            <NavBar />
            <main className="inicio">
                <img src="/inicio.png" alt="Sumate" className="inicio__img"/>
                <TurnoList />
            </main>
        </>
    );
};

export default Inicio;