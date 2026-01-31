package com.solidaritymap.repository;

import com.solidaritymap.model.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface CenterRepository extends JpaRepository<Center, UUID>, JpaSpecificationExecutor<Center> {

        @Query(value = "SELECT * FROM centers c WHERE ST_DWithin(c.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radiusInMeters)", nativeQuery = true)
        List<Center> findNearest(@Param("lat") double lat, @Param("lon") double lon,
                        @Param("radiusInMeters") double radiusInMeters);

        List<Center> findByStatus(com.solidaritymap.model.CenterStatus status);

        List<Center> findByTypeAndStatus(com.solidaritymap.model.CenterType type,
                        com.solidaritymap.model.CenterStatus status);

        List<Center> findByType(com.solidaritymap.model.CenterType type);
}
