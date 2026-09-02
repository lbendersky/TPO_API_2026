package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface UsuarioService {
    List<Usuario> getAll();
    Optional<Usuario> getById(Long idUsuario);
    Usuario actualizar(Long idUsuario, Usuario usuario) throws RecursoNoEncontradoException;
    void eliminar(Long idUsuario);
    Optional<Usuario> buscarPorEmail(String email);
}
