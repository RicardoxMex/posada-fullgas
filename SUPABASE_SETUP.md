# Configuración de Supabase para Sistema de Votaciones

## Pasos para configurar Supabase

### 1. Crear un proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la URL del proyecto y la clave anónima (anon key)

### 2. Configurar la base de datos
1. En tu proyecto de Supabase, ve a la sección **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script SQL
4. Esto creará:
   - La tabla `votes` con los campos necesarios
   - Índices para mejorar el rendimiento
   - Políticas de seguridad (RLS) para permitir votaciones sin autenticación
   - Restricción única para evitar votos duplicados por sesión

### 3. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 4. Verificar la configuración
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Ve a `/votaciones` y completa una votación
3. Ve a `/resultados` para ver los resultados en tiempo real
4. Verifica en Supabase (Table Editor) que los votos se están guardando

## Estructura de la tabla `votes`

| Campo       | Tipo      | Descripción                                    |
|-------------|-----------|------------------------------------------------|
| id          | UUID      | ID único del voto (generado automáticamente)  |
| session_id  | TEXT      | ID de sesión único por votante                 |
| category_id | TEXT      | ID de la categoría votada                      |
| nominee_id  | TEXT      | ID del nominado seleccionado                   |
| created_at  | TIMESTAMP | Fecha y hora del voto                          |

## Características implementadas

✅ **Votaciones sin login**: Los usuarios pueden votar sin necesidad de crear cuenta
✅ **Timeout de 30 minutos**: Después de votar, el usuario debe esperar 30 minutos para votar nuevamente
✅ **Resultados programados**: Los resultados solo están disponibles después de una fecha/hora específica
✅ **Cuenta regresiva**: Muestra el tiempo restante hasta que los resultados estén disponibles
✅ **Revelación progresiva**: Los resultados se muestran categoría por categoría con botón "Siguiente"
✅ **Resumen final**: Después de ver todas las categorías, se muestra un resumen completo
✅ **Prevención de votos duplicados**: Un usuario no puede votar dos veces en la misma categoría durante una sesión
✅ **Interfaz intuitiva**: Diseño moderno con feedback visual y animaciones

## Seguridad

- **Row Level Security (RLS)** habilitado para proteger los datos
- **Políticas de acceso** configuradas para permitir solo INSERT y SELECT
- **Restricción única** a nivel de base de datos para evitar duplicados
- **Cookies con expiración** para controlar el timeout de votación
- **Session ID único** generado por cada votante

## Configurar fecha de publicación de resultados

Para cambiar la fecha y hora en que los resultados estarán disponibles, edita el archivo `app/resultados/page.tsx`:

```typescript
// Línea 20 - Cambia esta fecha a la que desees
const RESULTS_RELEASE_DATE = new Date('2025-12-15T18:00:00');
```

Formato: `'YYYY-MM-DDTHH:mm:ss'` (hora local del servidor/navegador)

Ejemplos:
- `'2025-12-25T20:00:00'` - 25 de diciembre de 2025 a las 8:00 PM
- `'2026-01-01T00:00:00'` - 1 de enero de 2026 a medianoche

## Flujo de la página de resultados

1. **Antes de la fecha**: Muestra pantalla de bloqueo con cuenta regresiva
2. **Pantalla inicial**: Botón "Ver Resultados" con vista previa de categorías
3. **Revelación progresiva**: Muestra cada categoría con sus resultados, botones Anterior/Siguiente
4. **Resumen final**: Después de ver todas las categorías, muestra resumen completo con todos los ganadores

## Notas adicionales

- Los votos se guardan inmediatamente en Supabase
- Los resultados se bloquean hasta la fecha configurada
- La cuenta regresiva se actualiza cada segundo
- El timeout de votación se maneja con cookies del navegador
- Si el usuario borra las cookies, podrá votar nuevamente antes de los 30 minutos
- Los resultados se muestran con animaciones suaves y efectos visuales
