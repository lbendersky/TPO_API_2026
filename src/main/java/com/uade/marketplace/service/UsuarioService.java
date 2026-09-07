package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface UsuarioService {
    List<UsuarioResponse> getAll();
    Optional<UsuarioResponse> getById(Long idUsuario);
    UsuarioResponse actualizar(Long idUsuario, Usuario usuario) throws RecursoNoEncontradoException;
    void eliminar(Long idUsuario);
    Optional<UsuarioResponse> buscarPorEmail(String email);
}
