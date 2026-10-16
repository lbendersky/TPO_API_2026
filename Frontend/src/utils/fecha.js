// Fromatea la fecha proveniente de la base de datos

export const formatearFechaHora = (fechaHora) => {
    if (!fechaHora) return '';
    const fecha = new Date(fechaHora);
    if (isNaN(fecha.getTime())) return fechaHora;
    const fechaStr = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    const horaStr = fecha.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
    }).toLowerCase();
    return `${fechaStr} - ${horaStr}`;
};
