package com.uade.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.marketplace.dto.request.InscripcionRequest;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.entity.enums.Rol;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class InscripcionServiceImpl implements InscripcionService{
    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private TurnoRepository turnoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private OfertaService ofertaService;

    public List<InscripcionResponse> getAll() {
        return inscripcionRepository.findAll().stream().map(InscripcionResponse::from).toList();
    }

    public Optional<InscripcionResponse> getById(Long idInscripcion, Usuario actor) throws AccesoDenegadoException {
        Optional<Inscripcion> inscripcion = inscripcionRepository.findById(idInscripcion);
        if (inscripcion.isEmpty()) return Optional.empty();
        validarOwnershipInscripcion(inscripcion.get(), actor);
        return inscripcion.map(InscripcionResponse::from);
    }

    @Override
    public List<InscripcionResponse> getPorUsuario(Long idUsuario, Usuario actor) throws AccesoDenegadoException {
        if (actor.getRol() != Rol.ADMIN && !actor.getIdUsuario().equals(idUsuario))
            throw new AccesoDenegadoException("No podés ver las inscripciones de otro usuario");
        return inscripcionRepository.findByUsuarioComprador_IdUsuario(idUsuario).stream().map(InscripcionResponse::from).toList();
    }

    @Override
    public List<InscripcionResponse> getPorTurno(Long idTurno, Usuario actor) throws RecursoNoEncontradoException, AccesoDenegadoException {
        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));
        boolean esOrganizador = turno.getUsuario() != null && turno.getUsuario().getIdUsuario().equals(actor.getIdUsuario());
        boolean esAdmin = actor.getRol() == Rol.ADMIN;
        if (!esOrganizador && !esAdmin)
            throw new AccesoDenegadoException("No podés ver las inscripciones de este turno");
        return inscripcionRepository.findByTurno_IdTurno(idTurno).stream().map(InscripcionResponse::from).toList();
    }

    private void validarOwnershipInscripcion(Inscripcion inscripcion, Usuario actor) throws AccesoDenegadoException {
        if (actor.getRol() == Rol.ADMIN) return;
        if (inscripcion.getUsuarioComprador() == null || !inscripcion.getUsuarioComprador().getIdUsuario().equals(actor.getIdUsuario()))
            throw new AccesoDenegadoException("No podés ver esta inscripción");
    }

    @Transactional(rollbackFor = Throwable.class)
    @Override
    public InscripcionResponse crear(InscripcionRequest request, Usuario actor) throws RecursoNoEncontradoException, TurnoSinCuposException {
        if (request.getIdTurno() == null)
            throw new RecursoNoEncontradoException("Falta indicar el turno de la inscripcion");

        Turno turno = turnoRepository.findById(request.getIdTurno())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + request.getIdTurno()));
        Usuario comprador = usuarioRepository.findById(actor.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + actor.getIdUsuario()));

        if (turno.getLugaresDisponibles() <= 0)
            throw new TurnoSinCuposException();

        turno.setLugaresDisponibles(turno.getLugaresDisponibles() - 1);
        if (turno.getLugaresDisponibles() == 0)
            turno.setEstado(EstadoTurno.LLENO);
        turnoRepository.save(turno);

        Float precioFinal = ofertaService.calcularPrecioConDescuento(turno.getPrecioPorJugador(), ofertaService.obtenerOfertaActivaPorTurno(turno.getIdTurno()).orElse(null));

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setTurno(turno);
        inscripcion.setUsuarioComprador(comprador);
        inscripcion.setFechaCompra(LocalDateTime.now());
        inscripcion.setMontoPagado(precioFinal.doubleValue());
        inscripcion.setEstadoPago(EstadoPago.PENDIENTE);

        return InscripcionResponse.from(inscripcionRepository.save(inscripcion));
    }

    public InscripcionResponse actualizarEstadoPago(Long idInscripcion, EstadoPago nuevoEstado) throws RecursoNoEncontradoException {
        Inscripcion inscripcion = inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la inscripción"));

        inscripcion.setEstadoPago(nuevoEstado);
        return InscripcionResponse.from(inscripcionRepository.save(inscripcion));
    }

    public void eliminar(Long idInscripcion) {
        inscripcionRepository.deleteById(idInscripcion);
    }


}