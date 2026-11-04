import './Footer.css';
import { Link } from 'react-router-dom';
import { AtSign, MessageCircle, Share2, Globe } from 'lucide-react';

const ANIO_FUNDACION = 2026;

const Footer = () => {
    const anioActual = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__columnas">
                <div className="footer__columna">
                    <h4>Sobre MeSumo</h4>
                    <ul>
                        <li><Link to="/quienes-somos">Quiénes somos</Link></li>
                    </ul>
                </div>

                <div className="footer__columna">
                    <h4>Para jugadores</h4>
                    <ul>
                        <li><Link to="/inicio">Buscar canchas</Link></li>
                        <li><Link to="/mis-inscripciones">Mis inscripciones</Link></li>
                        <li><Link to="/carrito">Mi carrito</Link></li>
                    </ul>
                </div>

                <div className="footer__columna">
                    <h4>Para dueños de canchas</h4>
                    <ul>
                        <li><Link to="/publicar-cancha">Publicá tu cancha</Link></li>
                        <li><Link to="/mis-canchas">Mis canchas</Link></li>
                    </ul>
                </div>

                <div className="footer__columna">
                    <h4>Ayuda</h4>
                    <ul>
                        <li><Link to="/contacto">Contacto</Link></li>
                        <li><Link to="/terminos-y-condiciones">Términos y condiciones</Link></li>
                    </ul>
                </div>

                <div className="footer__columna">
                    <h4>Seguinos</h4>
                    <ul className="footer__redes">
                        <li><span className="footer__red-icono" aria-label="Instagram"><AtSign /></span></li>
                        <li><span className="footer__red-icono" aria-label="Facebook"><MessageCircle /></span></li>
                        <li><span className="footer__red-icono" aria-label="Twitter"><Share2 /></span></li>
                        <li><span className="footer__red-icono" aria-label="Youtube"><Globe /></span></li>
                    </ul>
                </div>
            </div>

            <div className="footer__legal">
                <ul className="footer__legal-links">
                    <li><Link to="/terminos-y-condiciones">Términos y condiciones</Link></li>
                </ul>
                <p className="footer__copyright">© {ANIO_FUNDACION}-{anioActual} MeSumo. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;