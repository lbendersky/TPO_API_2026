package com.uade.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.entity.enums.TipoFutbol;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByCanchaAndFechaHora(Cancha cancha, LocalDateTime fechaHora);
    List<Turno> findByCancha_IdCancha(Long idCancha);
    List<Turno> findByLugaresDisponiblesGreaterThan(Integer lugares);
    List<Turno> findByUsuario_IdUsuario(Long idUsuario);
    long countByEstado(EstadoTurno estado);

    @Query("SELECT t FROM Turno t WHERE t.cancha = :cancha " +
           "AND t.fechaHora >= :desde AND t.fechaHora < :hasta")
    List<Turno> findByCanchaEnVentana(@Param("cancha") Cancha cancha,
                                       @Param("desde") LocalDateTime desde,
                                       @Param("hasta") LocalDateTime hasta);

    @Query("SELECT t FROM Turno t WHERE " +
           "(:tipoFutbol IS NULL OR t.tipoFutbol = :tipoFutbol) AND " +
           "(:precioMin IS NULL OR t.precioPorJugador >= :precioMin) AND " +
           "(:precioMax IS NULL OR t.precioPorJugador <= :precioMax)")
    List<Turno> filtrar(@Param("tipoFutbol") TipoFutbol tipoFutbol,
                        @Param("precioMin") Float precioMin,
                        @Param("precioMax") Float precioMax);
}