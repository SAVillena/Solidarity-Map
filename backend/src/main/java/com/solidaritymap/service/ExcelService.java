package com.solidaritymap.service;

import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.repository.CenterRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelService {

    private final CenterRepository centerRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public void importCenters(MultipartFile file) throws IOException {
        List<Center> centers = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Skip header if present
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                Row row = rows.next();
                Center center = mapRowToCenter(row);
                if (center != null) {
                    centers.add(center);
                }
            }

            centerRepository.saveAll(centers);
        }
    }

    private Center mapRowToCenter(Row row) {
        try {
            Center center = new Center();
            // Assuming Excel columns Order: Name, Address, Contact, Type, Lat, Lon

            center.setName(getCellValue(row.getCell(0)));
            center.setAddress(getCellValue(row.getCell(1)));
            center.setContactNumber(getCellValue(row.getCell(2)));
            
            String typeStr = getCellValue(row.getCell(3));
            center.setType(CenterType.valueOf(typeStr.toUpperCase()));

            double lat = Double.parseDouble(getCellValue(row.getCell(4)));
            double lon = Double.parseDouble(getCellValue(row.getCell(5)));

            Point location = geometryFactory.createPoint(new Coordinate(lon, lat));
            location.setSRID(4326);
            center.setLocation(location);
            
            // Default values
            center.setUrgencyStatus(0); 

            return center;
        } catch (Exception e) {
            // Log error or skip row
            System.err.println("Error parsing row " + row.getRowNum() + ": " + e.getMessage());
            return null;
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return "";
        }
    }
}
