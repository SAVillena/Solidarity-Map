# Formato de Archivo Excel para Importación de Centros

Para importar centros a la aplicación, el archivo Excel debe seguir este formato:

## Estructura de Columnas

| Columna | Nombre Campo | Tipo | Requerido | Ejemplo |
|---------|--------------|------|-----------|---------|
| A | Name | Texto | ✅ Sí | Centro de Acopio San Miguel |
| B | Address | Texto | ✅ Sí | Av. Libertador 1234, Santiago |
| C | Contact Number | Texto | ❌ No | +56912345678 |
| D | Type | Texto | ✅ Sí | ACOPIO o VETERINARIA |
| E | Latitude | Número | ✅ Sí | -33.4489 |
| F | Longitude | Número | ✅ Sí | -70.6693 |

## Reglas de Validación

### Type (Columna D)
- Valores válidos: `ACOPIO` o `VETERINARIA`
- No distingue mayúsculas/minúsculas

### Latitude (Columna E)
- Debe estar entre -90 y 90
- Formato decimal (ejemplo: -33.4489)

### Longitude (Columna F)
- Debe estar entre -180 y 180
- Formato decimal (ejemplo: -70.6693)

## Ejemplo de Datos

```
Name                          | Address                      | Contact Number  | Type         | Latitude  | Longitude
Centro Acopio La Florida     | Av. Vicuña Mackenna 6000    | +56912345678   | ACOPIO       | -33.5170  | -70.5995
Veterinaria Pet Care         | Av. Apoquindo 5400          | +56987654321   | VETERINARIA  | -33.4109  | -70.5752
Centro Acopio Maipú          | Av. Pajaritos 3000          |                | ACOPIO       | -33.5110  | -70.7637
```

## Notas Importantes

⚠️ **El archivo debe ser formato .xlsx** (Excel 2007 o posterior)

⚠️ **La primera fila se considera encabezado** y se omite durante la importación

⚠️ **Filas con errores se omitirán** pero la importación continuará con las filas válidas

✅ **Los logs mostrarán errores específicos** indicando el número de fila y qué campo tiene el problema

## Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "El nombre es obligatorio (columna A)" | Campo vacío | Completar el nombre del centro |
| "Tipo inválido en columna D: 'CENTRO'" | Tipo no reconocido | Usar solo ACOPIO o VETERINARIA |
| "Latitud inválida en columna E: 'abc'" | Texto en lugar de número | Usar formato decimal -33.4489 |
| "Latitud fuera de rango: 95" | Valor fuera del rango permitido | Latitud debe estar entre -90 y 90 |
