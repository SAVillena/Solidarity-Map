package com.solidaritymap;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import java.io.FileOutputStream;
import java.io.IOException;

public class TestExcelGenerator {

    @Test
    public void generateSampleExcel() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Centros");

            // Header
            Row header = sheet.createRow(0);
            String[] headers = { "Nombre", "Dirección", "Contacto", "Tipo", "Latitud", "Longitud" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data
            Object[][] data = {
                    { "Centro Acopio Santiago", "Av. Providencia 123", "+56911111111", "ACOPIO", "-33.4262800",
                            "-70.6107800" },
                    { "Veterinaria de Emergencia", "Calle Valparaíso 456", "+56922222222", "VETERINARIA", "-33.4275000",
                            "-70.6120000" },
                    { "Albergue Temporal", "Alameda 789", "+56933333333", "ACOPIO", "-33.4400000", "-70.6500000" },
                    { "Clínica Vet 24h", "Irarrázaval 2000", "+56944444444", "VETERINARIA", "-33.4560000",
                            "-70.5900000" }
            };

            int rowNum = 1;
            for (Object[] rowData : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue((String) rowData[0]);
                row.createCell(1).setCellValue((String) rowData[1]);
                row.createCell(2).setCellValue((String) rowData[2]);
                row.createCell(3).setCellValue((String) rowData[3]);
                row.createCell(4).setCellValue((String) rowData[4]);
                row.createCell(5).setCellValue((String) rowData[5]);
            }

            // Write to file
            try (FileOutputStream fileOut = new FileOutputStream("test_centers.xlsx")) {
                workbook.write(fileOut);
            }
            System.out.println("Excel file created: test_centers.xlsx");
        }
    }
}
