package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.DTO.TurnoRequest;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
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
    public Page<Turno> getTurnos(PageRequest pageRequest) {
        return turnoRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Turno> getTurnoById(Long turnoId) {
        return turnoRepository.findById(turnoId);
    }

    @Override
    public Turno createTurno(TurnoRequest turnoRequest) throws TurnoDuplicateException {
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
}