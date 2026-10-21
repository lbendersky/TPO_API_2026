import Swal from 'sweetalert2';

export const Alerta = Swal.mixin({
    background: '#ffffff',
    color: '#214d21',
    confirmButtonColor: '#214d21',
    cancelButtonColor: '#d04f4f',
    iconColor: '#214d21',
});

export default Alerta;
