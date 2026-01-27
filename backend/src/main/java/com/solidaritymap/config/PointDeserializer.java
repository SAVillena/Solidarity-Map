package com.solidaritymap.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import java.io.IOException;

/**
 * Deserializer for GeoJSON Point to JTS Point
 */
public class PointDeserializer extends JsonDeserializer<Point> {

    private static final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public Point deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);

        if (node == null || node.isNull()) {
            return null;
        }

        // Expect GeoJSON format: {"type": "Point", "coordinates": [lon, lat]}
        JsonNode coordinates = node.get("coordinates");
        if (coordinates != null && coordinates.isArray() && coordinates.size() >= 2) {
            double lon = coordinates.get(0).asDouble();
            double lat = coordinates.get(1).asDouble();
            return geometryFactory.createPoint(new Coordinate(lon, lat));
        }

        return null;
    }
}
