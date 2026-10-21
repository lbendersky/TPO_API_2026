export const EtapaDelCheckout = ({ numero, nombre, activa }) => {
  return (
    <div className={`etapa ${activa ? 'etapa--activa' : ''}`}>
      <span className="etapa__numero">{numero}</span>
      <span>{nombre}</span>
    </div>
  )
}