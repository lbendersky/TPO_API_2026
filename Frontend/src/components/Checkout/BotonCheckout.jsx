import { Boton } from '../Boton/Boton';

export const BotonCheckout = ({ confirmarPago }) => {
  return (
    <Boton
      type="button"
      variante="primario"
      ancho="completo"
      onClick={confirmarPago}
    >
        Confirmar pago
    </Boton>
  )
}