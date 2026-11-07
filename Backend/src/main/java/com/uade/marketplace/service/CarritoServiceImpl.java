package com.uade.marketplace.service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.marketplace.dto.response.CarritoResponse;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Carrito;
import com.uade.marketplace.entity.Imagen;
import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.ItemCarrito;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.SolicitudInvalidaException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;
import com.uade.marketplace.repository.CarritoRepository;
import com.uade.marketplace.repository.ImagenRepository;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.ItemCarritoRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class CarritoServiceImpl implements CarritoService {

    private static final String IMAGEN_POR_DEFECTO = "static/imagenes/Pelota.png";
    public static final int MINUTOS_RESERVA = 15;

    @Autowired
    private CarritoRepository carritoRepository;
    @Autowired
    private ItemCarritoRepository itemCarritoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TurnoRepository turnoRepository;
    @Autowired
    private InscripcionRepository inscripcionRepository;
    @Autowired
    private ImagenRepository imagenRepository;
    @Autowired
    private OfertaService ofertaService;

    private Carrito getOrCreateCarrito(Long idUsuario) throws RecursoNoEncontradoException {
        return carritoRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(idUsuario)
                            .orElseThrow(() -> new RuntimeException("No existe el usuario " + idUsuario));
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setFechaCreacion(LocalDateTime.now());
                    nuevo.setItems(new ArrayList<>());
                    return carritoRepository.save(nuevo);
                });
    }

    private boolean estaVencido(ItemCarrito item) {
        return item.getFechaReserva() == null
                || item.getFechaReserva().plusMinutes(MINUTOS_RESERVA).isBefore(LocalDateTime.now());
    }

    private void liberarLugares(ItemCarrito item) {
        Turno turno = item.getTurno();
        if (turno == null) return;
        turno.setLugaresDisponibles(turno.getLugaresDisponibles() + item.getCantidad());
        if (turno.getEstado() == EstadoTurno.LLENO && turno.getLugaresDisponibles() > 0)
            turno.setEstado(EstadoTurno.INCOMPLETO);
        turnoRepository.save(turno);
    }

    private void reservarLugares(Turno turno, int cantidad) throws TurnoSinCuposException {
        if (turno.getLugaresDisponibles() == null || turno.getLugaresDisponibles() < cantidad)
            throw new TurnoSinCuposException();
        turno.setLugaresDisponibles(turno.getLugaresDisponibles() - cantidad);
        if (turno.getLugaresDisponibles() == 0)
            turno.setEstado(EstadoTurno.LLENO);
        turnoRepository.save(turno);
    }

    private void limpiarExpirados(Carrito carrito) {
        Iterator<ItemCarrito> it = carrito.getItems().iterator();
        while (it.hasNext()) {
            ItemCarrito item = it.next();
            if (estaVencido(item)) {
                liberarLugares(item);
                it.remove();
                itemCarritoRepository.delete(item);
            }
        }
    }

    private CarritoResponse construirResponse(Carrito carrito) {
        Set<Long> idsCancha = new HashSet<>();
        for (ItemCarrito item : carrito.getItems()) {
            if (item.getTurno() != null && item.getTurno().getCancha() != null)
                idsCancha.add(item.getTurno().getCancha().getIdCancha());
        }

        Map<Long, String> imagenes = new HashMap<>();
        if (!idsCancha.isEmpty()) {
            for (Imagen imagen : imagenRepository.findByCancha_IdCanchaIn(idsCancha)) {
                Long idCancha = imagen.getCancha().getIdCancha();
                imagenes.computeIfAbsent(idCancha, k -> aBase64Silencioso(imagen.getImagen()));
            }
        }

        String porDefecto = imagenPorDefecto();
        for (Long id : idsCancha) imagenes.putIfAbsent(id, porDefecto);

        return CarritoResponse.from(carrito, imagenes, MINUTOS_RESERVA);
    }

    private String aBase64Silencioso(Blob blob) {
        if (blob == null) return null;
        try {
            byte[] bytes = blob.getBytes(1, (int) blob.length());
            return Base64.getEncoder().encodeToString(bytes);
        } catch (SQLException e) {
            return null;
        }
    }

    private String imagenPorDefecto() {
        try {
            byte[] bytes = new ClassPathResource(IMAGEN_POR_DEFECTO).getInputStream().readAllBytes();
            return Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public CarritoResponse getPorUsuario(Long idUsuario) throws RecursoNoEncontradoException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        limpiarExpirados(carrito);
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse agregarItem(Long idUsuario, Long idTurno, Integer cantidad) throws RecursoNoEncontradoException {
        if (cantidad == null || cantidad <= 0)
            throw new SolicitudInvalidaException("La cantidad debe ser mayor a 0");

        Carrito carrito = getOrCreateCarrito(idUsuario);
        limpiarExpirados(carrito);

        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));

        ItemCarrito item = itemCarritoRepository
                .findByCarrito_IdCarritoAndTurno_IdTurno(carrito.getIdCarrito(), idTurno)
                .orElse(null);

        Float precioActual = ofertaService.calcularPrecioConDescuento(turno.getPrecioPorJugador(), ofertaService.obtenerOfertaActivaPorTurno(idTurno).orElse(null));

        try {
            reservarLugares(turno, cantidad);
        } catch (TurnoSinCuposException e) {
            throw new SolicitudInvalidaException(e.getMessage());
        }

        if (item == null) {
            item = new ItemCarrito();
            item.setCarrito(carrito);
            item.setTurno(turno);
            item.setCantidad(cantidad);
            item.setPrecioUnitario(precioActual);
            item.setFechaReserva(LocalDateTime.now());
            carrito.getItems().add(item);
        } else {
            item.setCantidad(item.getCantidad() + cantidad);
            item.setPrecioUnitario(precioActual);
            item.setFechaReserva(LocalDateTime.now());
        }
        itemCarritoRepository.save(item);
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse actualizarCantidad(Long idUsuario, Long idItem, Integer cantidad) throws RecursoNoEncontradoException {
        if (cantidad == null || cantidad <= 0)
            throw new SolicitudInvalidaException("La cantidad debe ser mayor a 0");

        Carrito carrito = getOrCreateCarrito(idUsuario);
        limpiarExpirados(carrito);

        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el item " + idItem));
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito()))
            throw new RecursoNoEncontradoException("El item no pertenece al carrito del usuario");

        int delta = cantidad - item.getCantidad();
        if (delta > 0) {
            try {
                reservarLugares(item.getTurno(), delta);
            } catch (TurnoSinCuposException e) {
                throw new SolicitudInvalidaException(e.getMessage());
            }
        } else if (delta < 0) {
            Turno turno = item.getTurno();
            turno.setLugaresDisponibles(turno.getLugaresDisponibles() + (-delta));
            if (turno.getEstado() == EstadoTurno.LLENO && turno.getLugaresDisponibles() > 0)
                turno.setEstado(EstadoTurno.INCOMPLETO);
            turnoRepository.save(turno);
        }

        item.setCantidad(cantidad);
        item.setFechaReserva(LocalDateTime.now());
        itemCarritoRepository.save(item);
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public CarritoResponse quitarItem(Long idUsuario, Long idItem) throws RecursoNoEncontradoException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        limpiarExpirados(carrito);

        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el item " + idItem));
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito()))
            throw new RecursoNoEncontradoException("El item no pertenece al carrito del usuario");

        liberarLugares(item);
        carrito.getItems().removeIf(i -> i.getIdItem().equals(idItem));
        itemCarritoRepository.delete(item);
        return construirResponse(carrito);
    }

    @Override
    @Transactional
    public void vaciar(Long idUsuario) throws RecursoNoEncontradoException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        for (ItemCarrito item : carrito.getItems()) {
            if (!estaVencido(item)) liberarLugares(item);
        }
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public List<InscripcionResponse> checkout(Long idUsuario) throws RecursoNoEncontradoException, TurnoSinCuposException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        limpiarExpirados(carrito);
        if (carrito.getItems().isEmpty())
            throw new RecursoNoEncontradoException("El carrito esta vacio o la reserva expiro");

        Usuario comprador = carrito.getUsuario();
        List<Inscripcion> inscripciones = new ArrayList<>();

        for (ItemCarrito item : carrito.getItems()) {
            Turno turno = turnoRepository.findByIdParaInscribir(item.getTurno().getIdTurno())
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + item.getTurno().getIdTurno()));

            Float precioFinal = ofertaService.calcularPrecioConDescuento(turno.getPrecioPorJugador(), ofertaService.obtenerOfertaActivaPorTurno(turno.getIdTurno()).orElse(null));

            for (int i = 0; i < item.getCantidad(); i++) {
                Inscripcion inscripcion = new Inscripcion();
                inscripcion.setTurno(turno);
                inscripcion.setUsuarioComprador(comprador);
                inscripcion.setFechaCompra(LocalDateTime.now());
                inscripcion.setMontoPagado(precioFinal.doubleValue());
                inscripcion.setEstadoPago(EstadoPago.PENDIENTE);
                inscripciones.add(inscripcionRepository.save(inscripcion));
            }
        }

        carrito.getItems().clear();
        carritoRepository.save(carrito);
        return inscripciones.stream().map(InscripcionResponse::from).toList();
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void liberarReservasExpiradas() {
        LocalDateTime limite = LocalDateTime.now().minusMinutes(MINUTOS_RESERVA);
        List<ItemCarrito> expirados = itemCarritoRepository.findByFechaReservaBefore(limite);
        for (ItemCarrito item : expirados) {
            liberarLugares(item);
            Carrito carrito = item.getCarrito();
            if (carrito != null) carrito.getItems().removeIf(i -> i.getIdItem().equals(item.getIdItem()));
            itemCarritoRepository.delete(item);
        }
    }
}
