package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.dto.request.TurnoRequest;
import com.uade.marketplace.dto.response.TurnoResponse;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.TipoFutbol;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;

public interface TurnoService {

    List<TurnoResponse> getTurnos();

    Optional<TurnoResponse> getTurnoById(Long turnoId);

    Turno crearTurno(TurnoRequest turnoRequest, Usuario actor) throws TurnoDuplicateException;

    void eliminarTurno(Long turnoId, Usuario actor) throws RecursoNoEncontradoException;

    Turno actualizarTurno(Long idTurno, TurnoRequest turnoRequest, Usuario actor) throws RecursoNoEncontradoException;

    List<TurnoResponse> getTurnosPorCancha(Long idCancha);

    List<TurnoResponse> getTurnosDisponibles();

    List<TurnoResponse> getTurnosPorUsuario(Long idUsuario);

    Turno setImagen(Long idTurno, String imagenPath, Usuario actor) throws RecursoNoEncontradoException;

    Turno actualizarStock(Long idTurno, Integer lugaresDisponibles, Usuario actor) throws RecursoNoEncontradoException;

    List<TurnoResponse> filtrar(TipoFutbol tipoFutbol, Float precioMin, Float precioMax);
}
