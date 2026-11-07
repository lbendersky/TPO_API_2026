import './TerminosYCondiciones.css';
import VolverAtras from '../../components/VolverAtras/VolverAtras';


const TerminosYCondiciones = () => {
    return (
        <section className="terminos">
            <VolverAtras/>
            <h1>Términos y condiciones</h1>
            <p className="terminos__actualizacion">Última actualización: noviembre de 2026</p>

            <h2>1. Introducción</h2>
            <p>
                Estos términos regulan el uso de MeSumo, una plataforma que conecta jugadores que
                buscan sumarse a un turno de fútbol con dueños de canchas que publican su disponibilidad.
                Al usar la plataforma, aceptás estas condiciones.
            </p>

            <h2>2. Uso de la plataforma</h2>
            <p>
                Para reservar un turno o publicar una cancha es necesario crear una cuenta con datos
                reales. Cada usuario es responsable de la información que carga y de mantener su
                contraseña en forma segura.
            </p>

            <h2>3. Reservas y pagos</h2>
            <p>
                Al inscribirte a un turno, te comprometés a abonar el monto correspondiente según lo
                publicado por el dueño de la cancha. Los precios y condiciones de cada turno son
                definidos por quien publica la cancha.
            </p>

            <h2>4. Cancelaciones</h2>
            <p>
                Las cancelaciones de un turno deben realizarse con la anticipación necesaria para no
                afectar a los demás jugadores inscriptos. El incumplimiento reiterado puede derivar en
                la suspensión de la cuenta.
            </p>

            <h2>5. Responsabilidad</h2>
            <p>
                MeSumo actúa como intermediario entre jugadores y dueños de canchas. No nos hacemos
                responsables por el estado de las instalaciones ni por conflictos entre usuarios, más
                allá de facilitar los canales de contacto correspondientes.
            </p>

            <h2>6. Modificaciones</h2>
            <p>
                Estos términos pueden actualizarse a medida que la plataforma evolucione. Te
                recomendamos revisarlos periódicamente.
            </p>

            <h2>7. Contacto</h2>
            <p>
                Ante cualquier consulta sobre estos términos, podés escribirnos desde la sección de
                Contacto.
            </p>
        </section>
    );
};

export default TerminosYCondiciones;