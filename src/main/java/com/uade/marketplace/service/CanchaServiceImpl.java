package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.response.CanchaResponse;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Localidad;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.Rol;
import com.uade.marketplace.entity.enums.TipoSuperficie;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.LocalidadRepository;
import com.uade.marketplace.repository.UsuarioRepository;


@Service
public class CanchaServiceImpl implements CanchaService {
    @Autowired
    private CanchaRepository canchaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private LocalidadRepository localidadRepository;

        @Override
    public List<CanchaResponse> getAll() {
        return canchaRepository.findByActivaTrue().stream().map(CanchaResponse::from).toList();
    }

    @Override
    public Optional<CanchaResponse> getById(Long idCancha) {
        return canchaRepository.findById(idCancha).map(CanchaResponse::from);
    }

    @Override
    public List<CanchaResponse> buscarPorLocalidad(String localidad) {
        return canchaRepository.findByLocalidad_NombreAndActivaTrue(localidad).stream().map(CanchaResponse::from).toList();
    }

    @Override
    public List<CanchaResponse> buscarPorSuperficie(TipoSuperficie tipoSuperficie) {
        return canchaRepository.findByTipoSuperficieAndActivaTrue(tipoSuperficie).stream().map(CanchaResponse::from).toList();
    }

    @Override
    public CanchaResponse publicar(Cancha cancha) throws RecursoNoEncontradoException {
        Usuario publicador = usuarioRepository.findById(cancha.getPublicador().getIdUsuario())
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + cancha.getPublicador().getIdUsuario()));
        Localidad localidad = localidadRepository.findById(cancha.getLocalidad().getIdLocalidad())
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe la localidad " + cancha.getLocalidad().getIdLocalidad()));
        cancha.setPublicador(publicador);
        cancha.setLocalidad(localidad);
        if (cancha.getActiva() == null)
            cancha.setActiva(true);
        return CanchaResponse.from(canchaRepository.save(cancha));
    }

    @Override
    public CanchaResponse actualizar(Long idCancha, Cancha cancha) throws RecursoNoEncontradoException {
        Cancha existente = canchaRepository.findById(idCancha)
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe la cancha " + idCancha));
        Localidad localidad = localidadRepository.findById(cancha.getLocalidad().getIdLocalidad())
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe la localidad " + cancha.getLocalidad().getIdLocalidad()));
        existente.setNombre(cancha.getNombre());
        existente.setDireccion(cancha.getDireccion());
        existente.setLocalidad(localidad);
        existente.setTipoSuperficie(cancha.getTipoSuperficie());
        existente.setPrecioUnitario(cancha.getPrecioUnitario());
        existente.setDescripcion(cancha.getDescripcion());
        existente.setCantidadJugadores(cancha.getCantidadJugadores());
        return CanchaResponse.from(canchaRepository.save(existente));
    }

    @Override
    public void eliminar(Long idCancha, Usuario usuarioActual, String motivo) throws RecursoNoEncontradoException, AccesoDenegadoException {
        Cancha cancha = canchaRepository.findById(idCancha)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la cancha " + idCancha));

        boolean esDueño = cancha.getPublicador() != null
                && cancha.getPublicador().getIdUsuario().equals(usuarioActual.getIdUsuario());
        boolean esAdmin = usuarioActual.getRol() == Rol.ADMIN;

        if (!esDueño && !esAdmin)
            throw new AccesoDenegadoException("No tenés permiso para dar de baja esta cancha");

        cancha.setActiva(false);
        if (esAdmin && !esDueño)
            cancha.setMotivoBaja(motivo);

        canchaRepository.save(cancha);
    }

    @Override
    public List<CanchaResponse> getCanchasPorPublicador(Long idUsuario) {
        return canchaRepository.findByPublicador_IdUsuario(idUsuario).stream().map(CanchaResponse::from).toList();
    }

    @Override
    public List<CanchaResponse> getAllAdmin() {
        return canchaRepository.findAll().stream().map(CanchaResponse::from).toList();
    }
}
