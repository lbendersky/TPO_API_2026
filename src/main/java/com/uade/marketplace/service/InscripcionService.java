package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface InscripcionService {

    List<Inscripcion> getAll();
    Optional<Inscripcion>getById (Long idInscripcion);
    Inscripcion crear (Inscripcion inscripcion);
    Inscripcion actualizarEstadoPago(Long idInscripcion, EstadoPago nuevoEstado) throws RecursoNoEncontradoException;
    void eliminar(Long idInscripcion);
}
