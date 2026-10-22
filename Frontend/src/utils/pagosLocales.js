const CLAVE = 'estadosPagoInscripciones'

const leer = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? {}
  } catch {
    return {}
  }
}

export const guardarEstadosPago = (ids, estado) => {
  const mapa = leer()
  ids.forEach((id) => {
    mapa[id] = estado
  })
  localStorage.setItem(CLAVE, JSON.stringify(mapa))
}

export const obtenerEstadosPago = () => leer()
