package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.dto.response.CanchaResponse;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.TipoSuperficie;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface CanchaService {
    List<CanchaResponse> getAll();
    Optional<CanchaResponse> getById(Long idCancha);
    List<CanchaResponse> buscarPorLocalidad(String localidad);
    List<CanchaResponse> buscarPorSuperficie(TipoSuperficie tipoSuperficie);
    CanchaResponse publicar (Cancha cancha) throws RecursoNoEncontradoException;
    CanchaResponse actualizar(Long idCancha, Cancha cancha) throws RecursoNoEncontradoException;
    void eliminar(Long idCancha, Usuario usuarioActual, String motivo) throws RecursoNoEncontradoException, AccesoDenegadoException;
    List<CanchaResponse> getCanchasPorPublicador(Long idUsuario);
    List<CanchaResponse> getAllAdmin();

}
