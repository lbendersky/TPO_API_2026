package com.uade.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.EstadoTurno;
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

    public List<Inscripcion> getAll() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> getById(Long idInscripcion) {
        return inscripcionRepository.findById(idInscripcion);
    }

    @Override
    public List<Inscripcion> getPorUsuario(Long idUsuario) {
        return inscripcionRepository.findByUsuarioComprador_IdUsuario(idUsuario);
    }

    @Override
    public List<Inscripcion> getPorTurno(Long idTurno) {
        return inscripcionRepository.findByTurno_IdTurno(idTurno);
    }

    @Override
    public Inscripcion crear(Inscripcion inscripcion) throws RecursoNoEncontradoException, TurnoSinCuposException {
        if (inscripcion.getTurno() == null || inscripcion.getTurno().getIdTurno() == null)
            throw new RecursoNoEncontradoException("Falta indicar el turno de la inscripcion");
        if (inscripcion.getUsuarioComprador() == null || inscripcion.getUsuarioComprador().getIdUsuario() == null)
            throw new RecursoNoEncontradoException("Falta indicar el usuario comprador");

        Turno turno = turnoRepository.findById(inscripcion.getTurno().getIdTurno())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + inscripcion.getTurno().getIdTurno()));
        Usuario comprador = usuarioRepository.findById(inscripcion.getUsuarioComprador().getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + inscripcion.getUsuarioComprador().getIdUsuario()));

        if (turno.getLugaresDisponibles() <= 0)
            throw new TurnoSinCuposException();

        turno.setLugaresDisponibles(turno.getLugaresDisponibles() - 1);
        if (turno.getLugaresDisponibles() == 0)
            turno.setEstado(EstadoTurno.LLENO);
        turnoRepository.save(turno);

        inscripcion.setTurno(turno);
        inscripcion.setUsuarioComprador(comprador);
        inscripcion.setFechaCompra(LocalDateTime.now());
        if (inscripcion.getEstadoPago() == null)
            inscripcion.setEstadoPago(EstadoPago.PENDIENTE);

        return inscripcionRepository.save(inscripcion);
    }

    public Inscripcion actualizarEstadoPago(Long idInscripcion, EstadoPago nuevoEstado) throws RecursoNoEncontradoException {
        Inscripcion inscripcion = inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la inscripción"));

        inscripcion.setEstadoPago(nuevoEstado);
        return inscripcionRepository.save(inscripcion);
    }

    public void eliminar(Long idInscripcion) {
        inscripcionRepository.deleteById(idInscripcion);
    }


}
