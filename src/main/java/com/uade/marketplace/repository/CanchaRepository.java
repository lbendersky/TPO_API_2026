package com.uade.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Cancha;
@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long>{
    List<Cancha> findByLocalidad (String localidad);
    List<Cancha> findByPublicador_IdUsuario(Long idUsuario);
}
