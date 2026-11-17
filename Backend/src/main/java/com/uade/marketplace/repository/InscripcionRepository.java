package com.uade.marketplace.repository;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.enums.EstadoPago;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long>{
    List<Inscripcion> findByUsuarioComprador_IdUsuario(Long idUsuario);
    List<Inscripcion> findByTurno_IdTurno(Long idTurno);
    long countByEstadoPago(EstadoPago estadoPago);

    @Query("SELECT COALESCE(SUM(i.montoPagado), 0) FROM Inscripcion i WHERE i.estadoPago = :estadoPago")
    Double sumMontoPagadoByEstadoPago(@Param("estadoPago") EstadoPago estadoPago);

    @Query("SELECT COALESCE(SUM(i.montoPagado), 0) FROM Inscripcion i WHERE i.estadoPago = :estadoPago AND i.turno.fechaHora <= :ahora")
    Double sumMontoPagadoByEstadoPagoYFechaHasta(@Param("estadoPago") EstadoPago estadoPago, @Param("ahora") LocalDateTime ahora);

    @Query("SELECT COALESCE(SUM(i.montoPagado), 0) FROM Inscripcion i WHERE i.estadoPago = :estadoPago AND i.turno.fechaHora > :ahora")
    Double sumMontoPagadoByEstadoPagoYFechaDesde(@Param("estadoPago") EstadoPago estadoPago, @Param("ahora") LocalDateTime ahora);
}