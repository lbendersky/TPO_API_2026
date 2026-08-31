package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.UsuarioRepository;


@Service
public class CanchaServiceImpl implements CanchaService {
    @Autowired
    private CanchaRepository canchaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Cancha> getAll() {
        return canchaRepository.findAll();
    }

    @Override
    public Optional<Cancha> getById(Long idCancha) {
        return canchaRepository.findById(idCancha);
    }

    @Override
    public List<Cancha> buscarPorLocalidad(String localidad) {
        return canchaRepository.findByLocalidad(localidad);
    }

    @Override
    public Cancha publicar(Cancha cancha) throws RecursoNoEncontradoException {
        Usuario publicador = usuarioRepository.findById(cancha.getPublicador().getIdUsuario())
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + cancha.getPublicador().getIdUsuario()));
        cancha.setPublicador(publicador);
        return canchaRepository.save(cancha);
    }
    
    @Override
    public Cancha actualizar(Long idCancha, Cancha cancha) throws RecursoNoEncontradoException {
        Cancha existente = canchaRepository.findById(idCancha)
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe la cancha " + idCancha));
        existente.setNombre(cancha.getNombre());
        existente.setDireccion(cancha.getDireccion());
        existente.setLocalidad(cancha.getLocalidad());
        existente.setTipoSuperficie(cancha.getTipoSuperficie());
        existente.setPrecioUnitario(cancha.getPrecioUnitario());
        existente.setCantidadJugadores(cancha.getCantidadJugadores());
        return canchaRepository.save(existente);
    }

    @Override
    public void eliminar(Long idCancha) throws RecursoNoEncontradoException {
        if (!canchaRepository.existsById(idCancha))
            throw new RecursoNoEncontradoException("No existe la cancha " + idCancha);
        canchaRepository.deleteById(idCancha);
    }

}
