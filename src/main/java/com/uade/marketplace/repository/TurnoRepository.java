package com.uade.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Turno;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByCanchaAndFechaHora(Cancha cancha, LocalDateTime fechaHora);
}