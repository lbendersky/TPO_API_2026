package com.uade.marketplace.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.marketplace.entity.Carrito;
import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.ItemCarrito;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;
import com.uade.marketplace.repository.CarritoRepository;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.ItemCarritoRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class CarritoServiceImpl implements CarritoService {

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

    @Override
    public Carrito getPorUsuario(Long idUsuario) throws RecursoNoEncontradoException {
        return getOrCreateCarrito(idUsuario);
    }

    @Override
    @Transactional
    public Carrito agregarItem(Long idUsuario, Long idTurno, Integer cantidad) throws RecursoNoEncontradoException {
        if (cantidad == null || cantidad <= 0)
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");

        Carrito carrito = getOrCreateCarrito(idUsuario);
        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));

        ItemCarrito item = itemCarritoRepository
                .findByCarrito_IdCarritoAndTurno_IdTurno(carrito.getIdCarrito(), idTurno)
                .orElse(null);

        if (item == null) {
            item = new ItemCarrito();
            item.setCarrito(carrito);
            item.setTurno(turno);
            item.setCantidad(cantidad);
            item.setPrecioUnitario(turno.getPrecioPorJugador());
            carrito.getItems().add(item);
        } else {
            item.setCantidad(item.getCantidad() + cantidad);
        }
        itemCarritoRepository.save(item);
        return carrito;
    }

    @Override
    @Transactional
    public Carrito actualizarCantidad(Long idUsuario, Long idItem, Integer cantidad) throws RecursoNoEncontradoException {
        if (cantidad == null || cantidad <= 0)
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");

        Carrito carrito = getOrCreateCarrito(idUsuario);
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el item " + idItem));
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito()))
            throw new RecursoNoEncontradoException("El item no pertenece al carrito del usuario");

        item.setCantidad(cantidad);
        itemCarritoRepository.save(item);
        return carrito;
    }

    @Override
    @Transactional
    public Carrito quitarItem(Long idUsuario, Long idItem) throws RecursoNoEncontradoException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el item " + idItem));
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito()))
            throw new RecursoNoEncontradoException("El item no pertenece al carrito del usuario");

        carrito.getItems().removeIf(i -> i.getIdItem().equals(idItem));
        itemCarritoRepository.delete(item);
        return carrito;
    }

    @Override
    @Transactional
    public void vaciar(Long idUsuario) throws RecursoNoEncontradoException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public List<Inscripcion> checkout(Long idUsuario) throws RecursoNoEncontradoException, TurnoSinCuposException {
        Carrito carrito = getOrCreateCarrito(idUsuario);
        if (carrito.getItems().isEmpty())
            throw new RecursoNoEncontradoException("El carrito esta vacio");

        Usuario comprador = carrito.getUsuario();
        List<Inscripcion> inscripciones = new ArrayList<>();

        for (ItemCarrito item : carrito.getItems()) {
            Turno turno = turnoRepository.findById(item.getTurno().getIdTurno())
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + item.getTurno().getIdTurno()));

            if (turno.getLugaresDisponibles() < item.getCantidad())
                throw new TurnoSinCuposException();

            for (int i = 0; i < item.getCantidad(); i++) {
                turno.setLugaresDisponibles(turno.getLugaresDisponibles() - 1);

                Inscripcion inscripcion = new Inscripcion();
                inscripcion.setTurno(turno);
                inscripcion.setUsuarioComprador(comprador);
                inscripcion.setFechaCompra(LocalDateTime.now());
                inscripcion.setMontoPagado(item.getPrecioUnitario().doubleValue());
                inscripcion.setEstadoPago(EstadoPago.PENDIENTE);
                inscripciones.add(inscripcionRepository.save(inscripcion));
            }

            if (turno.getLugaresDisponibles() == 0)
                turno.setEstado(EstadoTurno.LLENO);
            turnoRepository.save(turno);
        }

        carrito.getItems().clear();
        carritoRepository.save(carrito);
        return inscripciones;
    }
}
