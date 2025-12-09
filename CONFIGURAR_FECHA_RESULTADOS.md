# 📅 Cómo Configurar la Fecha de Publicación de Resultados

## Ubicación del archivo

Abre el archivo: `app/resultados/page.tsx`

## Línea a modificar

Busca la **línea 20** que contiene:

```typescript
const RESULTS_RELEASE_DATE = new Date('2025-12-15T18:00:00');
```

## Formato de fecha

El formato es: `'YYYY-MM-DDTHH:mm:ss'`

- **YYYY** = Año (4 dígitos)
- **MM** = Mes (01-12)
- **DD** = Día (01-31)
- **HH** = Hora en formato 24h (00-23)
- **mm** = Minutos (00-59)
- **ss** = Segundos (00-59)

## Ejemplos

```typescript
// Navidad 2025 a las 8:00 PM
const RESULTS_RELEASE_DATE = new Date('2025-12-25T20:00:00');

// Año Nuevo 2026 a medianoche
const RESULTS_RELEASE_DATE = new Date('2026-01-01T00:00:00');

// 15 de enero de 2026 a las 3:30 PM
const RESULTS_RELEASE_DATE = new Date('2026-01-15T15:30:00');

// Hoy a las 6:00 PM (cambia la fecha)
const RESULTS_RELEASE_DATE = new Date('2025-12-08T18:00:00');
```

## ¿Qué pasa antes de la fecha?

Antes de la fecha configurada, los usuarios verán:
- 🔒 Pantalla de "Resultados Bloqueados"
- ⏰ Cuenta regresiva en tiempo real
- 📅 Fecha y hora exacta de publicación

## ¿Qué pasa después de la fecha?

Después de la fecha configurada, los usuarios podrán:
- ✅ Ver el botón "Ver Resultados"
- 📊 Navegar categoría por categoría
- 🏆 Ver el resumen completo al final

## Nota importante

⚠️ La fecha usa la **hora local del navegador del usuario**, no la hora del servidor.

Si necesitas usar una zona horaria específica, puedes usar:

```typescript
// Ejemplo con zona horaria UTC
const RESULTS_RELEASE_DATE = new Date('2025-12-15T18:00:00Z');

// Ejemplo con zona horaria específica (GMT-5)
const RESULTS_RELEASE_DATE = new Date('2025-12-15T18:00:00-05:00');
```
