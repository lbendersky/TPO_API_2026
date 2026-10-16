package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.marketplace.dto.request.UsuarioRequest;
import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.repository.CarritoRepository;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private TurnoRepository turnoRepository;

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
    public UsuarioResponse actualizar(Long idUsuario, UsuarioRequest request) throws RecursoNoEncontradoException{
        Usuario usuarioActualizado = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + idUsuario));
        if (request.getNombreUsuario() != null) usuarioActualizado.setNombreUsuario(request.getNombreUsuario());
        if (request.getDni() != null) usuarioActualizado.setDni(request.getDni());
        if (request.getNombre() != null) usuarioActualizado.setNombre(request.getNombre());
        if (request.getApellido() != null) usuarioActualizado.setApellido(request.getApellido());
        if (request.getEmail() != null) usuarioActualizado.setEmail(request.getEmail());
        if (request.getContrasena() != null && !request.getContrasena().isBlank()) {
            usuarioActualizado.setContrasena(passwordEncoder.encode(request.getContrasena()));
        }
        if (request.getTelefono() != null) usuarioActualizado.setTelefono(request.getTelefono());
        return UsuarioResponse.from(usuarioRepository.save(usuarioActualizado));
    }

    @Override
    @Transactional
    public void eliminar(Long idUsuario) throws RecursoNoEncontradoException {
        if (!usuarioRepository.existsById(idUsuario))
            throw new RecursoNoEncontradoException("No existe el usuario " + idUsuario);

        // Borrar inscripciones del usuario como comprador
        inscripcionRepository.deleteAll(
                inscripcionRepository.findByUsuarioComprador_IdUsuario(idUsuario));

        // Borrar los turnos que organiza y sus inscripciones asociadas
        for (Turno turno : turnoRepository.findByUsuario_IdUsuario(idUsuario)) {
            inscripcionRepository.deleteAll(
                    inscripcionRepository.findByTurno_IdTurno(turno.getIdTurno()));
            turnoRepository.delete(turno);
        }

        // Borrar el carrito del usuario (los items se borran por orphanRemoval)
        carritoRepository.findByUsuario_IdUsuario(idUsuario)
                .ifPresent(carritoRepository::delete);

        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public Optional<UsuarioResponse> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).map(UsuarioResponse::from);
    }
}
