-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Centers Table
CREATE TABLE IF NOT EXISTS centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_number VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    
    -- Urgency Status: 
    -- 0: Verde (No requiere)
    -- 1: Amarillo (Abastecidos)
    -- 2: Rojo (Crítico)
    urgency_status INT DEFAULT 0,
    
    -- Operating hours as plain text (e.g., "Lun-Vie 9-18")
    operating_hours TEXT,
    
    -- Categories/Supplies
    -- Stored as JSON array: ["Alimentos", "Agua", "Medicamentos"]
    supplies_needed JSONB DEFAULT '[]',
    
    -- Geolocation (PostGIS Geography Point)
    -- SRID 4326 is WGS 84 (GPS standard)
    location GEOGRAPHY(POINT, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Index for Geospatial queries (knn)
CREATE INDEX idx_centers_location ON centers USING GIST (location);

-- Trigger to update 'updated_at' automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_centers_timestamp
BEFORE UPDATE ON centers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
