import { useEffect, useState } from 'react'

function formatearTiempo(totalSegundos) {
  const minutos = String(Math.floor(totalSegundos / 60)).padStart(2, '0')
  const segundos = String(totalSegundos % 60).padStart(2, '0')
  return `${minutos}:${segundos}`
}

export const ContadorAvisoCarrito = ({ minutos = 15 }) => {
  const [segundos, setSegundos] = useState(minutos * 60)
  const termino = segundos === 0

  useEffect(() => {
    if (termino) return

    const idIntervalo = setInterval(() => {
      setSegundos((s) => s - 1)
    }, 1000)

    return () => clearInterval(idIntervalo)
  }, [termino])

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
      <svg
        className="h-5 w-5 text-stone-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2M5 3 2 6M19 3l3 3" />
      </svg>

      <span
        className={`text-lg font-extrabold tabular-nums ${
          termino ? 'text-red-600' : 'text-amber-900'
        }`}
      >
        {formatearTiempo(segundos)}
      </span>

      <span className="text-xs font-semibold tracking-wide text-slate-600">
        RESTANTES
      </span>
    </div>
  )
}
