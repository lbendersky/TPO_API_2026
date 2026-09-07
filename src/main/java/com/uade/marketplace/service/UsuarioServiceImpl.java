package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioResponse> getAll() {
        return usuarioRepository.findAll().stream().map(UsuarioResponse::from).toList();
    }

    @Override
    public Optional<UsuarioResponse> getById(Long idUsuario) {
        return usuarioRepository.findById(idUsuario).map(UsuarioResponse::from);
    }

    @Override
    public UsuarioResponse actualizar(Long idUsuario, Usuario usuario) throws RecursoNoEncontradoException{
        Usuario usuarioActualizado = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + idUsuario));
        if (usuario.getNombreUsuario() != null) usuarioActualizado.setNombreUsuario(usuario.getNombreUsuario());
        if (usuario.getDni() != null) usuarioActualizado.setDni(usuario.getDni());
        if (usuario.getNombre() != null) usuarioActualizado.setNombre(usuario.getNombre());
        if (usuario.getApellido() != null) usuarioActualizado.setApellido(usuario.getApellido());
        if (usuario.getEmail() != null) usuarioActualizado.setEmail(usuario.getEmail());
        if (usuario.getContrasena() != null && !usuario.getContrasena().isBlank()) {
            usuarioActualizado.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        }
        if (usuario.getTelefono() != null) usuarioActualizado.setTelefono(usuario.getTelefono());
        return UsuarioResponse.from(usuarioRepository.save(usuarioActualizado));
    }

    @Override
    public void eliminar(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public Optional<UsuarioResponse> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).map(UsuarioResponse::from);
    }
}
