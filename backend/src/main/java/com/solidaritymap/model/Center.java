package com.solidaritymap.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "centers")
public class Center {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(name = "contact_number")
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CenterType type;

    @Column(name = "urgency_status")
    private Integer urgencyStatus; // 0, 1, 2

    @Column(name = "operating_hours", columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String operatingHours; // Storing as JSON String for simplicity initially

    @Column(name = "supplies_needed", columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String suppliesNeeded;

    // PostGIS Point
    @Column(columnDefinition = "geography(Point,4326)")
    @com.fasterxml.jackson.databind.annotation.JsonSerialize(using = com.solidaritymap.config.PointSerializer.class)
    @com.fasterxml.jackson.databind.annotation.JsonDeserialize(using = com.solidaritymap.config.PointDeserializer.class)
    private Point location;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
