import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'
import { useAuth } from '../../context/useAuth'
import { BotonCheckout } from '../../components/Checkout/BotonCheckout'
import { HeaderCarrito } from '../../components/Carrito/Header/HeaderCarrito'

import '../Carrito/Carrito.css'
import '../../components/Carrito/Header/CarritoHeader.css'
import './Checkout.css'

const Checkout = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const confirmarPago = async () => {
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

      const inscripciones = await response.json()
      navigate('/inicio', { state: { inscripciones } })
      } catch (e) {
        setError(e.message)
      }
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