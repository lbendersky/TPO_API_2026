package com.uade.marketplace.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Inscripcion;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long>{
    List<Inscripcion> findByUsuarioComprador_IdUsuario(Long idUsuario);
    List<Inscripcion> findByTurno_IdTurno(Long idTurno);
}
