package com.uade.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.enums.TipoSuperficie;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {
    List<Cancha> findByLocalidad_NombreAndActivaTrue(String nombre);
    List<Cancha> findByLocalidad_IdLocalidad(Long idLocalidad);
    List<Cancha> findByTipoSuperficieAndActivaTrue(TipoSuperficie tipoSuperficie);
    List<Cancha> findByPublicador_IdUsuario(Long idUsuario);
    List<Cancha> findByActivaTrue();
    long countByActivaTrue();

}
