package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.request.TurnoRequest;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class TurnoServiceImpl implements TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CanchaRepository canchaRepository;

    @Override
    public List<Turno> getTurnos() {
        return turnoRepository.findAll();
    }

    @Override
    public Optional<Turno> getTurnoById(Long turnoId) {
        return turnoRepository.findById(turnoId);
    }

    @Override
    public List<Turno> getTurnosPorCancha(Long idCancha) {
        return turnoRepository.findByCancha_IdCancha(idCancha);
    }

    @Override
    public List<Turno> getTurnosDisponibles() {
        return turnoRepository.findByLugaresDisponiblesGreaterThan(0);
    }

    @Override
    public Turno crearTurno(TurnoRequest turnoRequest) throws TurnoDuplicateException {
        Usuario usuario = usuarioRepository.findById(turnoRequest.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Cancha cancha = canchaRepository.findById(turnoRequest.getIdCancha())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada"));

        List<Turno> turnosExistentes =
                turnoRepository.findByCanchaAndFechaHora(cancha, turnoRequest.getFechaHora());
        if (!turnosExistentes.isEmpty())
            throw new TurnoDuplicateException();

        Turno turno = new Turno(
                turnoRequest.getFechaHora(),
                turnoRequest.getTipoFutbol().name(),
                turnoRequest.getLugaresDisponibles(),
                turnoRequest.getPrecioPorJugador(),
                usuario,
                cancha
        );
        return turnoRepository.save(turno);
    }

    @Override
    public void eliminarTurno(Long idTurno) throws RecursoNoEncontradoException {
        if (!turnoRepository.existsById(idTurno))
            throw new RecursoNoEncontradoException("No existe el turno " + idTurno);

        turnoRepository.deleteById(idTurno);
    }

    @Override
    public Turno actualizarTurno(Long idTurno, TurnoRequest turnoRequest) throws RecursoNoEncontradoException {
        Optional<Turno> turnoExistente = turnoRepository.findById(idTurno);
        if (turnoExistente.isEmpty())
            throw new RecursoNoEncontradoException("No existe el turno");

        Usuario usuario = usuarioRepository.findById(turnoRequest.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se identifico un usuario"));
        Cancha cancha = canchaRepository.findById(turnoRequest.getIdCancha())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se identifico una cancha"));

        Turno turnoActualizado = turnoExistente.get();
        turnoActualizado.setFechaHora(turnoRequest.getFechaHora());
        turnoActualizado.setTipoFutbol(turnoRequest.getTipoFutbol().name());
        turnoActualizado.setLugaresDisponibles(turnoRequest.getLugaresDisponibles());
        turnoActualizado.setPrecioPorJugador(turnoRequest.getPrecioPorJugador());
        turnoActualizado.setUsuario(usuario);
        turnoActualizado.setCancha(cancha);
        return turnoRepository.save(turnoActualizado);
    }

    @Override
    public List<Turno> getTurnosPorUsuario(Long idUsuario) {
        return turnoRepository.findByUsuario_IdUsuario(idUsuario);
    }
}