import { useState } from 'react';
import './FormularioOferta.css';

const estadoInicial = { porcentajeDescuento: '', fechaInicio: '', fechaFin: '' };

const FormularioOferta = ({ turno, onCrear }) => {
    const [abierto, setAbierto] = useState(false);
    const [form, setForm] = useState(estadoInicial);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');

    const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

    const toggle = () => {
        setAbierto(!abierto);
        setError('');
        setOk('');
        if (abierto) setForm(estadoInicial);
    };

    const enviar = async (e) => {
        e.preventDefault();
        setError('');
        setOk('');
        const porcentaje = Number(form.porcentajeDescuento);
        if (!porcentaje || porcentaje <= 0 || porcentaje > 100) {
            setError('El porcentaje debe estar entre 1 y 100.');
            return;
        }
        if (!form.fechaInicio || !form.fechaFin) {
            setError('Indicá fecha de inicio y de fin.');
            return;
        }
        if (form.fechaInicio > form.fechaFin) {
            setError('La fecha de inicio no puede ser posterior a la de fin.');
            return;
        }
        setEnviando(true);
        try {
            await onCrear({
                idTurno: turno.idTurno,
                porcentajeDescuento: porcentaje,
                fechaInicio: form.fechaInicio,
                fechaFin: form.fechaFin,
            });
            setOk('Oferta creada correctamente.');
            setForm(estadoInicial);
            setAbierto(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="formulario-oferta">
            <button type="button" className="formulario-oferta__toggle" onClick={toggle}>
                {abierto ? 'Cancelar' : 'Crear oferta'}
            </button>
            {ok && <p className="formulario-oferta__ok">{ok}</p>}
            {abierto && (
                <form className="formulario-oferta__form" onSubmit={enviar}>
                    <label className="formulario-oferta__label">
                        Porcentaje de descuento
                        <input
                            type="number"
                            min="1"
                            max="100"
                            step="1"
                            value={form.porcentajeDescuento}
                            onChange={cambiar('porcentajeDescuento')}
                            required
                        />
                    </label>
                    <label className="formulario-oferta__label">
                        Desde
                        <input
                            type="date"
                            value={form.fechaInicio}
                            onChange={cambiar('fechaInicio')}
                            required
                        />
                    </label>
                    <label className="formulario-oferta__label">
                        Hasta
                        <input
                            type="date"
                            value={form.fechaFin}
                            onChange={cambiar('fechaFin')}
                            required
                        />
                    </label>
                    {error && <p className="formulario-oferta__error">{error}</p>}
                    <button type="submit" className="formulario-oferta__enviar" disabled={enviando}>
                        {enviando ? 'Creando...' : 'Confirmar oferta'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default FormularioOferta;
