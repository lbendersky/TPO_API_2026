import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'
import { useAuth } from '../../context/useAuth'
import { BotonCheckout } from '../../components/Checkout/BotonCheckout'
import { HeaderCarrito } from '../../components/Carrito/Header/HeaderCarrito'
import { formatearFechaHora } from '../../utils/fecha'

import '../Carrito/Carrito.css'
import '../../components/Carrito/Header/CarritoHeader.css'
import './Checkout.css'

const formatearMonto = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n ?? 0)

const Checkout = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [inscripciones, setInscripciones] = useState(null)

  const confirmarPago = async () => {
    setError('')
    try {
      const response = await fetch(`${API_URL}/carrito/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 409) {
        throw new Error('Alguno de los turnos ya no tiene cupos suficientes.')
      }
      if (!response.ok) {
        throw new Error('No se pudo completar la compra.')
      }

      const data = await response.json()
      setInscripciones(data)
    } catch (e) {
      setError(e.message)
    }
  }

  if (inscripciones) {
    const totalPagado = inscripciones.reduce((acc, i) => acc + (i.montoPagado ?? 0), 0)

    return (
      <main className="carrito-page">
        <HeaderCarrito etapaActual={2} />

        <section className="checkout-contenido">
          <h2 className="checkout-contenido__titulo">¡Reserva confirmada!</h2>
          <p className="checkout-contenido__texto">
            Reservamos {inscripciones.length === 1 ? 'tu turno' : `tus ${inscripciones.length} turnos`}. El pago queda registrado como pendiente.
          </p>

          <ul className="checkout-confirmacion__lista">
            {inscripciones.map((i) => (
              <li key={i.idInscripcion} className="checkout-confirmacion__item">
                <span className="checkout-confirmacion__turno">Turno #{i.idTurno}</span>
                <span className="checkout-confirmacion__fecha">{formatearFechaHora(i.fechaCompra)}</span>
                <span className="checkout-confirmacion__monto">{formatearMonto(i.montoPagado)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-confirmacion__total">
            <span>Total pagado</span>
            <strong>{formatearMonto(totalPagado)}</strong>
          </div>

          <button
            type="button"
            className="boton-confirmar-reserva"
            onClick={() => navigate('/inicio')}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="carrito-page">
      <HeaderCarrito etapaActual={2} />

      <section className="checkout-contenido">
        <h2 className="checkout-contenido__titulo">Confirmá tu pago</h2>
        <p className="checkout-contenido__texto">
          Al confirmar, se reservan tus turnos. El pago queda registrado como pendiente.
        </p>
        {error && <p className="checkout-contenido__error">{error}</p>}
        <BotonCheckout confirmarPago={confirmarPago} />
      </section>
    </main>
  )
}
export default Checkout;