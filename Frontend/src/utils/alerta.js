import Swal from 'sweetalert2';

export const Alerta = Swal.mixin({
    background: '#ffffff',
    color: '#214d21',
    confirmButtonColor: '#214d21',
    cancelButtonColor: '#d04f4f',
    iconColor: '#214d21',
});

export const confirmarEliminar = (nombre) => Alerta.fire({
    title: `¿Eliminar ${nombre}?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#c0392b',
});

export default Alerta;