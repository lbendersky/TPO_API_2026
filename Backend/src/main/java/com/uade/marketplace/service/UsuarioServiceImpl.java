package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.marketplace.dto.request.UsuarioRequest;
import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.UsuarioDuplicadoException;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.CarritoRepository;
import com.uade.marketplace.repository.ImagenRepository;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.ItemCarritoRepository;
import com.uade.marketplace.repository.OfertaRepository;
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
    private CanchaRepository canchaRepository;

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

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

    if (request.getNombreUsuario() != null && !request.getNombreUsuario().equals(usuarioActualizado.getNombreUsuario())
            && usuarioRepository.existsByNombreUsuario(request.getNombreUsuario()))
        throw new UsuarioDuplicadoException();
    if (request.getDni() != null && !request.getDni().equals(usuarioActualizado.getDni())
            && usuarioRepository.existsByDni(request.getDni()))
        throw new UsuarioDuplicadoException();
    if (request.getEmail() != null && !request.getEmail().equals(usuarioActualizado.getEmail())
            && usuarioRepository.existsByEmail(request.getEmail()))
        throw new UsuarioDuplicadoException();
    if (request.getTelefono() != null && !request.getTelefono().equals(usuarioActualizado.getTelefono())
            && usuarioRepository.existsByTelefono(request.getTelefono()))
        throw new UsuarioDuplicadoException();

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

        // Borrar los turnos que organiza (con todas sus dependencias)
        for (Turno turno : turnoRepository.findByUsuario_IdUsuario(idUsuario)) {
            eliminarTurnoEnCascada(turno);
        }

        // Borrar las canchas publicadas (con sus turnos e imagenes)
        for (Cancha cancha : canchaRepository.findByPublicador_IdUsuario(idUsuario)) {
            eliminarCanchaEnCascada(cancha);
        }

        // Borrar el carrito del usuario (los items se borran por orphanRemoval)
        carritoRepository.findByUsuario_IdUsuario(idUsuario)
                .ifPresent(carritoRepository::delete);

        usuarioRepository.deleteById(idUsuario);
    }

    private void eliminarTurnoEnCascada(Turno turno) {
        Long idTurno = turno.getIdTurno();
        ofertaRepository.deleteAll(ofertaRepository.findByTurno_IdTurno(idTurno));
        itemCarritoRepository.deleteAll(itemCarritoRepository.findByTurno_IdTurno(idTurno));
        inscripcionRepository.deleteAll(inscripcionRepository.findByTurno_IdTurno(idTurno));
        turnoRepository.delete(turno);
    }

    private void eliminarCanchaEnCascada(Cancha cancha) {
        imagenRepository.deleteAll(imagenRepository.findByCancha_IdCancha(cancha.getIdCancha()));
        for (Turno turno : turnoRepository.findByCancha_IdCancha(cancha.getIdCancha())) {
            eliminarTurnoEnCascada(turno);
        }
        canchaRepository.delete(cancha);
    }

    @Override
    public Optional<UsuarioResponse> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).map(UsuarioResponse::from);
    }
}
