# Sistema de Votación Única

## Cambios Implementados

Se ha modificado el sistema de votaciones para permitir **solo una votación por usuario de forma permanente**.

### Antes
- Los usuarios podían votar cada 30 minutos
- Se usaba un temporizador con cookies temporales
- Después de 30 minutos, las cookies expiraban y se podía votar nuevamente

### Ahora
- Los usuarios solo pueden votar **una vez**
- Se genera un ID único permanente por navegador/dispositivo
- El ID se guarda en una cookie que dura 10 años
- Se verifica en la base de datos si el usuario ya votó

## Cómo Funciona

1. **Generación de ID único**: Cuando un usuario accede por primera vez, se genera un ID único que se guarda en una cookie llamada `user_voting_id`

2. **Verificación al cargar**: Al entrar a la página de votaciones, se verifica en la base de datos si ese ID ya tiene votos registrados

3. **Bloqueo permanente**: Si el usuario ya votó, se muestra un mensaje indicando que ya participó y solo puede ver los resultados

4. **Doble verificación**: Antes de guardar los votos, se verifica nuevamente en la base de datos para evitar votos duplicados

## Seguridad

- El índice único en la base de datos (`idx_unique_vote_per_session_category`) previene votos duplicados a nivel de base de datos
- La cookie tiene una duración de 10 años para mantener el ID del usuario
- Se realizan verificaciones tanto en el cliente como en la base de datos

## Limitaciones

Este sistema identifica usuarios por navegador/dispositivo. Un usuario podría votar desde:
- Diferentes navegadores en el mismo dispositivo
- Diferentes dispositivos
- Modo incógnito (aunque la cookie se borrará al cerrar)
- Limpiando las cookies del navegador

Para una restricción más estricta, se necesitaría implementar autenticación de usuarios (login).
