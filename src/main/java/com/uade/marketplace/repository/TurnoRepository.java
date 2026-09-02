package com.uade.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Turno;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByCanchaAndFechaHora(Cancha cancha, LocalDateTime fechaHora);
    List<Turno> findByCancha_IdCancha(Long idCancha);
    List<Turno> findByLugaresDisponiblesGreaterThan(Integer lugares);
    List<Turno> findByUsuario_IdUsuario(Long idUsuario);
}