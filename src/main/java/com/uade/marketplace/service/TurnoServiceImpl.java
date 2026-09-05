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
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
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
    private OfertaRepository ofertaRepository;

    private TurnoResponse convertirATurnoResponse(Turno t, Map<Long, Oferta> mapaOfertas) {
        // La validación de fechas DESAPARECE. Si está en el mapa, está activa.
        Oferta ofertaActiva = mapaOfertas.get(t.getIdTurno());

        Double porcentaje = null;
        Float precioConDescuento = null;
        boolean tieneOferta = false;

        if (ofertaActiva != null) {
            porcentaje = ofertaActiva.getPorcentajeDescuento();
            precioConDescuento = t.getPrecioPorJugador() - (t.getPrecioPorJugador() * (porcentaje.floatValue() / 100.0f));
            tieneOferta = true;
        } else {
            precioConDescuento = t.getPrecioPorJugador();
        }

        return TurnoResponse.from(t, porcentaje, precioConDescuento, tieneOferta);
    }

    private List<TurnoResponse> mapear(List<Turno> turnos) {
        if (turnos.isEmpty()) return List.of();
        LocalDate hoy = LocalDate.now(); 
        List<Oferta> ofertasActivas = ofertaRepository.findActivas(hoy);
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

    @Override
    public Turno crearTurno(TurnoRequest turnoRequest) throws TurnoDuplicateException {
        Usuario usuario = usuarioRepository.findById(turnoRequest.getIdUsuario())
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
            .estado(EstadoTurno.INCOMPLETO)
            .usuario(usuario)
            .cancha(cancha)
            .build();
        return turnoRepository.save(turno);
    }

    @Override
    public void eliminarTurno(Long idTurno) throws RecursoNoEncontradoException {
        if (!turnoRepository.existsById(idTurno))
            throw new RecursoNoEncontradoException("No existe el turno " + idTurno);

        turnoRepository.deleteById(idTurno);
    }

    @Override
    public Turno actualizarTurno(Long idTurno, TurnoRequest turnoRequest) throws RecursoNoEncontradoException {
        Optional<Turno> turnoExistente = turnoRepository.findById(idTurno);
        if (turnoExistente.isEmpty())
            throw new RecursoNoEncontradoException("No existe el turno");

        Usuario usuario = usuarioRepository.findById(turnoRequest.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se identifico un usuario"));
        Cancha cancha = canchaRepository.findById(turnoRequest.getIdCancha())
                .orElseThrow(() -> new RecursoNoEncontradoException("No se identifico una cancha"));

        Turno turnoActualizado = turnoExistente.get();
        turnoActualizado.setFechaHora(turnoRequest.getFechaHora());
        turnoActualizado.setTipoFutbol(turnoRequest.getTipoFutbol());
        turnoActualizado.setLugaresDisponibles(turnoRequest.getLugaresDisponibles());
        turnoActualizado.setDescripcion(turnoRequest.getDescripcion());
        turnoActualizado.setPrecioPorJugador(turnoRequest.getPrecioPorJugador());
        turnoActualizado.setUsuario(usuario);
        turnoActualizado.setCancha(cancha);
        return turnoRepository.save(turnoActualizado);
    }
}