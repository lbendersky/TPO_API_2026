package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> getById(Long idUsuario) {
        return usuarioRepository.findById(idUsuario);
    }

    @Override
    public Usuario actualizar(Long idUsuario, Usuario usuario) throws RecursoNoEncontradoException{
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
        return usuarioRepository.save(usuarioActualizado);
    }

    @Override
    public void eliminar(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    
}
