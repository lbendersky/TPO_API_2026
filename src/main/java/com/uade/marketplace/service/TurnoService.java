package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.marketplace.dto.TurnoRequest;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;

public interface TurnoService {

    Page<Turno> getTurnos(PageRequest pageRequest);

    Optional<Turno> getTurnoById(Long turnoId);

    Turno crearTurno(TurnoRequest turnoRequest) throws TurnoDuplicateException;

    void eliminarTurno(Long turnoId) throws RecursoNoEncontradoException;

    Turno actualizarTurno(Long idTurno, TurnoRequest turnoRequest) throws RecursoNoEncontradoException;

    List<Turno> getTurnosPorCancha(Long idCancha);

    List<Turno> getTurnosDisponibles();
}
