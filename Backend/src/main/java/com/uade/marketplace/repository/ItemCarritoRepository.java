package com.uade.marketplace.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.ItemCarrito;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    Optional<ItemCarrito> findByCarrito_IdCarritoAndTurno_IdTurno(Long idCarrito, Long idTurno);
    List<ItemCarrito> findByTurno_IdTurno(Long idTurno);
    List<ItemCarrito> findByFechaReservaBefore(LocalDateTime limite);
}
