-- Inicialización de datos de prueba para Solidarity Map
-- Este script se ejecuta después de schema.sql

-- Insertar datos de prueba (centros en Chile)
-- Usando INSERT ... ON CONFLICT DO NOTHING para evitar duplicados

-- Insertar datos de prueba (centros en Chile)
-- Usando ON CONFLICT para evitar duplicados si re-ejecutamos el script

-- Región Metropolitana (Santiago y alrededores)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Santiago Centro', 'Av. Libertador Bernardo O''Higgins 1234, Santiago', '+56912345001', 'ACOPIO', 0, ST_SetSRID(ST_MakePoint(-70.6483, -33.4489), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria PetCare Providencia', 'Av. Providencia 2500, Providencia', '+56912345002', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-70.6119, -33.4298), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Centro Acopio Las Condes', 'Av. Apoquindo 4800, Las Condes', '+56912345003', 'ACOPIO', 1, ST_SetSRID(ST_MakePoint(-70.5693, -33.4072), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria AnimalSalud Maipú', 'Av. Pajaritos 1888, Maipú', '+56912345004', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-70.7661, -33.5115), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Centro Acopio Puente Alto', 'Av. Concha y Toro 1500, Puente Alto', '+56912345005', 'ACOPIO', 2, ST_SetSRID(ST_MakePoint(-70.5756, -33.6113), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Valparaíso y Viña del Mar
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Valparaíso Puerto', 'Av. Errázuriz 500, Valparaíso', '+56912345006', 'ACOPIO', 1, ST_SetSRID(ST_MakePoint(-71.6271, -33.0472), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria del Mar Viña', 'Av. Libertad 1234, Viña del Mar', '+56912345007', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-71.5520, -33.0245), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Centro Acopio Viña Centro', 'Calle Valparaíso 567, Viña del Mar', '+56912345008', 'ACOPIO', 0, ST_SetSRID(ST_MakePoint(-71.5519, -33.0245), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Concepción (Región del Biobío)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Concepción Centro', 'Av. O''Higgins 234, Concepción', '+56912345009', 'ACOPIO', 0, ST_SetSRID(ST_MakePoint(-73.0497, -36.8270), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria BíoBío', 'Av. Paicaví 3000, Concepción', '+56912345010', 'VETERINARIA', 1, ST_SetSRID(ST_MakePoint(-73.0445, -36.8201), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- La Serena (Región de Coquimbo)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio La Serena', 'Av. Francisco de Aguirre 123, La Serena', '+56912345011', 'ACOPIO', 0, ST_SetSRID(ST_MakePoint(-71.2518, -29.9077), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria Norte Verde', 'Av. del Mar 500, La Serena', '+56912345012', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-71.2691, -29.9027), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Temuco (Región de La Araucanía)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Temuco', 'Av. Alemania 800, Temuco', '+56912345013', 'ACOPIO', 1, ST_SetSRID(ST_MakePoint(-72.5904, -38.7359), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria Araucanía Pet', 'Av. Balmaceda 1500, Temuco', '+56912345014', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-72.6044, -38.7394), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Puerto Montt (Región de Los Lagos)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Puerto Montt', 'Av. Diego Portales 500, Puerto Montt', '+56912345015', 'ACOPIO', 0, ST_SetSRID(ST_MakePoint(-72.9420, -41.4693), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria Los Lagos', 'Av. Angelmó 2000, Puerto Montt', '+56912345016', 'VETERINARIA', 2, ST_SetSRID(ST_MakePoint(-72.9526, -41.4717), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Antofagasta (Región de Antofagasta)
INSERT INTO centers (id, name, address, contact_number, type, urgency_status, location, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'Centro Acopio Antofagasta', 'Av. Grecia 1000, Antofagasta', '+56912345017', 'ACOPIO', 1, ST_SetSRID(ST_MakePoint(-70.4000, -23.6509), 4326), NOW(), NOW()),
    (gen_random_uuid(), 'Veterinaria del Desierto', 'Av. Brasil 2500, Antofagasta', '+56912345018', 'VETERINARIA', 0, ST_SetSRID(ST_MakePoint(-70.3975, -23.6440), 4326), NOW(), NOW())
ON CONFLICT DO NOTHING;
