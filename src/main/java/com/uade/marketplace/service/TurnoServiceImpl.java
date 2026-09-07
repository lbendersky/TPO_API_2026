package com.uade.marketplace.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.request.TurnoRequest;
import com.uade.marketplace.dto.response.TurnoResponse;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.entity.enums.Rol;
import com.uade.marketplace.entity.enums.TipoFutbol;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import org.springframework.security.access.AccessDeniedException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.OfertaRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class TurnoServiceImpl implements TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CanchaRepository canchaRepository;

    @Autowired
    private OfertaService ofertaService;

    private TurnoResponse convertirATurnoResponse(Turno t, Map<Long, Oferta> mapaOfertas) {
        Oferta ofertaActiva = mapaOfertas.get(t.getIdTurno());
        Float precioConDescuento = ofertaService.calcularPrecioConDescuento(t.getPrecioPorJugador(), ofertaActiva);
        Double porcentaje = ofertaActiva != null ? ofertaActiva.getPorcentajeDescuento() : null;
        boolean tieneOferta = ofertaActiva != null;
        return TurnoResponse.from(t, porcentaje, precioConDescuento, tieneOferta);
    }

    private List<TurnoResponse> mapear(List<Turno> turnos) {
        if (turnos.isEmpty()) return List.of();
        List<Oferta> ofertasActivas = ofertaService.obtenerActivas();
        Map<Long, Oferta> mapaOfertas = ofertasActivas.stream()
                .filter(o -> o.getTurno() != null)
                .collect(Collectors.toMap(
                        o -> o.getTurno().getIdTurno(),
                        o -> o,
                        (o1, o2) -> o1.getPorcentajeDescuento() >= o2.getPorcentajeDescuento() ? o1 : o2
                ));

        return turnos.stream()
                .map(t -> convertirATurnoResponse(t, mapaOfertas))
                .toList();
    }

    @Override
    public List<TurnoResponse> getTurnos() {
        return mapear(turnoRepository.findAll());
    }

    @Override
    public Optional<TurnoResponse> getTurnoById(Long turnoId) {
        return turnoRepository.findById(turnoId)
                .map(t -> mapear(List.of(t)).get(0));
    }

    @Override
    public List<TurnoResponse> getTurnosPorCancha(Long idCancha) {
        return mapear(turnoRepository.findByCancha_IdCancha(idCancha));
    }

    @Override
    public List<TurnoResponse> getTurnosDisponibles() {
        return mapear(turnoRepository.findByLugaresDisponiblesGreaterThan(0));
    }

    @Override
    public List<TurnoResponse> getTurnosPorUsuario(Long idUsuario) {
        return mapear(turnoRepository.findByUsuario_IdUsuario(idUsuario));
    }

    private void validarOwnership(Turno turno, Usuario actor) {
        if (actor.getRol() == Rol.ADMIN) return;
        if (turno.getUsuario() == null || !turno.getUsuario().getIdUsuario().equals(actor.getIdUsuario()))
            throw new AccessDeniedException("No sos el dueño de este turno");
    }

    @Override
    public Turno crearTurno(TurnoRequest turnoRequest, Usuario actor) throws TurnoDuplicateException {
        Usuario usuario = usuarioRepository.findById(actor.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Cancha cancha = canchaRepository.findById(turnoRequest.getIdCancha())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada"));

        List<Turno> turnosExistentes =
                turnoRepository.findByCanchaAndFechaHora(cancha, turnoRequest.getFechaHora());
        if (!turnosExistentes.isEmpty())
            throw new TurnoDuplicateException();

        Turno turno = Turno.builder()
            .fechaHora(turnoRequest.getFechaHora())
            .tipoFutbol(turnoRequest.getTipoFutbol())
            .lugaresDisponibles(turnoRequest.getLugaresDisponibles())
            .precioPorJugador(turnoRequest.getPrecioPorJugador())
            .descripcion(turnoRequest.getDescripcion())
            .imagenPath(turnoRequest.getImagenPath())
            .estado(EstadoTurno.INCOMPLETO)
            .usuario(usuario)
            .cancha(cancha)
            .build();
        return turnoRepository.save(turno);
    }

    @Override
    public void eliminarTurno(Long idTurno, Usuario actor) throws RecursoNoEncontradoException {
        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));
        validarOwnership(turno, actor);
        turnoRepository.delete(turno);
    }

    @Override
    public Turno actualizarTurno(Long idTurno, TurnoRequest turnoRequest, Usuario actor) throws RecursoNoEncontradoException {
        Turno turnoActualizado = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno"));
        validarOwnership(turnoActualizado, actor);

        Cancha cancha = canchaRepository.findById(turnoRequest.getIdCancha())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se identifico una cancha"));

        turnoActualizado.setFechaHora(turnoRequest.getFechaHora());
        turnoActualizado.setTipoFutbol(turnoRequest.getTipoFutbol());
        turnoActualizado.setLugaresDisponibles(turnoRequest.getLugaresDisponibles());
        turnoActualizado.setDescripcion(turnoRequest.getDescripcion());
        turnoActualizado.setImagenPath(turnoRequest.getImagenPath());
        turnoActualizado.setPrecioPorJugador(turnoRequest.getPrecioPorJugador());
        turnoActualizado.setCancha(cancha);
        return turnoRepository.save(turnoActualizado);
    }

    @Override
    public Turno setImagen(Long idTurno, String imagenPath, Usuario actor) throws RecursoNoEncontradoException {
        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));
        validarOwnership(turno, actor);
        turno.setImagenPath(imagenPath);
        return turnoRepository.save(turno);
    }

    @Override
    public Turno actualizarStock(Long idTurno, Integer lugaresDisponibles, Usuario actor) throws RecursoNoEncontradoException {
        if (lugaresDisponibles == null || lugaresDisponibles < 0)
            throw new IllegalArgumentException("lugaresDisponibles debe ser >= 0");

        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el turno " + idTurno));
        validarOwnership(turno, actor);
        turno.setLugaresDisponibles(lugaresDisponibles);
        turno.setEstado(lugaresDisponibles == 0 ? EstadoTurno.LLENO : EstadoTurno.INCOMPLETO);
        return turnoRepository.save(turno);
    }

    @Override
    public List<TurnoResponse> filtrar(TipoFutbol tipoFutbol, Float precioMin, Float precioMax) {
        return mapear(turnoRepository.filtrar(tipoFutbol, precioMin, precioMax));
    }
}