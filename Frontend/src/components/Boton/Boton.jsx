import './Boton.css';

export const Boton = ({
    variante = 'primario',
    tamaño,
    ancho,
    type = 'button',
    className = '',
    children,
    ...resto
}) => {
    const clases = [
        'boton',
        `boton--${variante}`,
        tamaño === 'chico' ? 'boton--chico' : '',
        tamaño === 'grande' ? 'boton--grande' : '',
        ancho === 'completo' ? 'boton--completo' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button type={type} className={clases} {...resto}>
            {children}
        </button>
    );
};

export default Boton;