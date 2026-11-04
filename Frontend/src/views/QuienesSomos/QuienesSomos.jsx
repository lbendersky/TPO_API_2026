import { Link } from 'react-router-dom';
import './QuienesSomos.css';

const QuienesSomos = () => {
    return (
        <section className="quienes-somos">
            <h1>Quiénes somos</h1>
            <p>
                MeSumo es una plataforma pensada para que armar un partido de fútbol sea tan fácil
                como pedir una comida: buscás una cancha disponible cerca tuyo, te sumás a un turno
                que ya está armado o publicás el tuyo propio, y listo.
            </p>
            <p>
                Nació como proyecto de la materia Aplicaciones Interactivas en UADE, con la idea de
                resolver un problema bien concreto: coordinar jugadores y canchas sin pasar horas en
                grupos de WhatsApp. Conectamos a jugadores que buscan sumarse a un partido con dueños
                de canchas que quieren llenar sus horarios libres.
            </p>
            <p>
                Seguimos construyendo el proyecto, así que si tenés sugerencias o encontrás algo que
                no funciona como debería, podés escribirnos desde <Link to="/contacto">Contacto</Link>.
            </p>
        </section>
    );
};

export default QuienesSomos;