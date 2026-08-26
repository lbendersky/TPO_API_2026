package com.uade.marketplace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.marketplace.entity.DTO.TurnoRequest;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.exceptions.TurnoDuplicateException;

public interface TurnoService {

    Page<Turno> getTurnos(PageRequest pageRequest);

    Optional<Turno> getTurnoById(Long turnoId);

    Turno createTurno(TurnoRequest turnoRequest) throws TurnoDuplicateException;
}
