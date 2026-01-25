package com.solidaritymap.repository;

import com.solidaritymap.model.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CenterRepository extends JpaRepository<Center, UUID> {
    // Spatial queries can be added here later
}
