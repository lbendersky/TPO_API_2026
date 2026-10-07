import './Inicio.css';

import NavBar from '../components/NavBar/NavBar';
import TurnoList from '../components/TurnoList';

const Inicio = () => {
    return (
        <>
            <NavBar />
            <main className="inicio">
                <h1 className="inicio__titulo">
                    Turnos disponibles
                </h1>
                <TurnoList />
            </main>
        </>
    );
};

export default Inicio;