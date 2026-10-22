import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'
import { useAuth } from '../../context/useAuth'
import { BotonCheckout } from '../../components/Checkout/BotonCheckout'
import { HeaderCarrito } from '../../components/Carrito/Header/HeaderCarrito'
import { formatearFechaHora } from '../../utils/fecha'
import { guardarEstadosPago } from '../../utils/pagosLocales'

import '../Carrito/Carrito.css'
import '../../components/Carrito/Header/CarritoHeader.css'
import './Checkout.css'

const formatearMonto = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n ?? 0)

const soloDigitos = (v) => v.replace(/\D/g, '')

const formatearNumeroTarjeta = (v) =>
  soloDigitos(v).slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const formatearVencimiento = (v) => {
  const d = soloDigitos(v).slice(0, 4)
  if (d.length < 3) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

const validarTarjeta = ({ numero, titular, vencimiento, cvv }) => {
  const num = soloDigitos(numero)
  if (num.length !== 16) return 'El número de tarjeta debe tener 16 dígitos.'
  if (!titular.trim()) return 'Ingresá el nombre del titular.'
  const match = vencimiento.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return 'El vencimiento debe tener formato MM/AA.'
  const mes = parseInt(match[1], 10)
  if (mes < 1 || mes > 12) return 'El mes del vencimiento es inválido.'
  if (!/^\d{3,4}$/.test(cvv)) return 'El CVV debe tener 3 o 4 dígitos.'
  return ''
}

const Checkout = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [inscripciones, setInscripciones] = useState(null)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [metodoConfirmado, setMetodoConfirmado] = useState('tarjeta')
  const [tarjeta, setTarjeta] = useState({ numero: '', titular: '', vencimiento: '', cvv: '' })

  const confirmarPago = async () => {
    setError('')

    if (metodoPago === 'tarjeta') {
      const err = validarTarjeta(tarjeta)
      if (err) {
        setError(err)
        return
      }
    }

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
      const estadoLocal = metodoPago === 'tarjeta' ? 'PAGADO' : 'EFECTIVO'
      guardarEstadosPago(data.map((i) => i.idInscripcion), estadoLocal)
      setMetodoConfirmado(metodoPago)
      setInscripciones(data)
    } catch (e) {
      setError(e.message)
    }
  }

  if (inscripciones) {
    const totalPagado = inscripciones.reduce((acc, i) => acc + (i.montoPagado ?? 0), 0)
    const fueTarjeta = metodoConfirmado === 'tarjeta'

    return (
      <main className="carrito-page">
        <HeaderCarrito etapaActual={2} />

        <section className="checkout-contenido">
          <h2 className="checkout-contenido__titulo">¡Reserva confirmada!</h2>
          <p className="checkout-contenido__texto">
            Reservamos {inscripciones.length === 1 ? 'tu turno' : `tus ${inscripciones.length} turnos`}.{' '}
            {fueTarjeta
              ? 'El pago con tarjeta se registró como pagado.'
              : 'El pago se registró como efectivo (abonás en la cancha).'}
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
          Elegí cómo querés pagar tus turnos.
        </p>

        <div className="checkout-metodo">
          <label className={`checkout-metodo__opcion ${metodoPago === 'tarjeta' ? 'checkout-metodo__opcion--activa' : ''}`}>
            <input
              type="radio"
              name="metodoPago"
              value="tarjeta"
              checked={metodoPago === 'tarjeta'}
              onChange={() => setMetodoPago('tarjeta')}
            />
            <span>Tarjeta</span>
          </label>
          <label className={`checkout-metodo__opcion ${metodoPago === 'efectivo' ? 'checkout-metodo__opcion--activa' : ''}`}>
            <input
              type="radio"
              name="metodoPago"
              value="efectivo"
              checked={metodoPago === 'efectivo'}
              onChange={() => setMetodoPago('efectivo')}
            />
            <span>Efectivo</span>
          </label>
        </div>

        {metodoPago === 'tarjeta' && (
          <div className="checkout-tarjeta">
            <label className="checkout-tarjeta__campo">
              <span>Número de tarjeta</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={tarjeta.numero}
                onChange={(e) => setTarjeta({ ...tarjeta, numero: formatearNumeroTarjeta(e.target.value) })}
              />
            </label>
            <label className="checkout-tarjeta__campo">
              <span>Titular</span>
              <input
                type="text"
                autoComplete="cc-name"
                placeholder="Nombre como figura en la tarjeta"
                value={tarjeta.titular}
                onChange={(e) => setTarjeta({ ...tarjeta, titular: e.target.value })}
              />
            </label>
            <div className="checkout-tarjeta__fila">
              <label className="checkout-tarjeta__campo">
                <span>Vencimiento</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                  value={tarjeta.vencimiento}
                  onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: formatearVencimiento(e.target.value) })}
                />
              </label>
              <label className="checkout-tarjeta__campo">
                <span>CVV</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={tarjeta.cvv}
                  onChange={(e) => setTarjeta({ ...tarjeta, cvv: soloDigitos(e.target.value).slice(0, 4) })}
                />
              </label>
            </div>
          </div>
        )}

        {metodoPago === 'efectivo' && (
          <p className="checkout-contenido__texto">
            Vas a abonar en efectivo al llegar a la cancha. Reservamos tu turno igual.
          </p>
        )}

        {error && <p className="checkout-contenido__error">{error}</p>}
        <BotonCheckout confirmarPago={confirmarPago} />
      </section>
    </main>
  )
}
export default Checkout;
