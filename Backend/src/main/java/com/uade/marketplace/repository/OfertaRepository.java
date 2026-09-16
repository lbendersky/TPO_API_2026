package com.uade.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.uade.marketplace.entity.Oferta;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfertaRepository extends JpaRepository <Oferta, Long>  {
        List<Oferta> findByTurno_IdTurno(Long idTurno);

        @Query("SELECT o FROM Oferta o WHERE :hoy BETWEEN o.fechaInicio AND o.fechaFin")
        List<Oferta> findActivas(@Param("hoy") LocalDate hoy);

}
