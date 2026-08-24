package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Usuario;

public interface UsuarioService {
    List<Usuario> getAll();
    Optional<Usuario> getById(Long idUsuario);
    Usuario crear(Usuario usuario);
    Usuario actualizar(Long idUsuario, Usuario usuario);
    void eliminar(Long idUsuario);
    Optional<Usuario> buscarPorEmail(String email);
}
