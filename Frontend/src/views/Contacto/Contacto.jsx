import { Mail, MapPin } from 'lucide-react';
import './Contacto.css';

const Contacto = () => {
    return (
        <section className="contacto">
            <h1>Contacto</h1>
            <p>
                ¿Tenés una duda, una sugerencia o encontraste algo que no funciona? Escribinos,
                te respondemos a la brevedad.
            </p>

            <div className="contacto__datos">
                <a href="mailto:contacto@mesumo.com" className="contacto__dato">
                    <Mail />
                    <span>contacto@mesumo.com</span>
                </a>
                <div className="contacto__dato">
                    <MapPin />
                    <span>Buenos Aires, Argentina</span>
                </div>
            </div>
        </section>
    );
};

export default Contacto;