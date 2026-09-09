package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.dto.request.InscripcionRequest;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;

public interface InscripcionService {

    List<InscripcionResponse> getAll();
    Optional<InscripcionResponse> getById(Long idInscripcion, Usuario actor) throws AccesoDenegadoException;
    InscripcionResponse crear (InscripcionRequest request, Usuario actor) throws RecursoNoEncontradoException, TurnoSinCuposException;
    InscripcionResponse actualizarEstadoPago(Long idInscripcion, EstadoPago nuevoEstado) throws RecursoNoEncontradoException;
    void eliminar(Long idInscripcion);
    List<InscripcionResponse> getPorUsuario(Long idUsuario, Usuario actor) throws AccesoDenegadoException;
    List<InscripcionResponse> getPorTurno(Long idTurno, Usuario actor) throws RecursoNoEncontradoException, AccesoDenegadoException;
}