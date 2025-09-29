# 🔐 Instrucciones para Crear Usuario Administrador

## Pasos para el Cliente

### 1. Registro de Usuario Administrador
1. Vaya a: `https://su-sitio-web.com/login`
2. Haga clic en "Registrarse" o "Crear cuenta"
3. Complete el formulario con:
   - **Email:** `admin@publiexpert.com` (o su email preferido)
   - **Nombre:** Su nombre completo
   - **Contraseña:** Una contraseña segura (mínimo 8 caracteres)
4. Complete el proceso de verificación de email
5. Confirme su cuenta siguiendo el enlace enviado por email

### 2. Solicitar Permisos de Administrador
Una vez registrado, contacte al soporte técnico:

**Email:** `nathan@publiexpert.com`
**Asunto:** Solicitud de permisos de administrador
**Mensaje:**
```
Hola,

He completado el registro de mi cuenta de administrador en el sitio web.

Detalles de la cuenta:
- Email registrado: admin@publiexpert.com (o su email usado)
- Sitio web: [URL de su sitio web]
- Fecha de registro: [fecha]

Por favor, asignen el rol de "Administrator" a esta cuenta para poder acceder al panel de administración.

Gracias,
[Su nombre]
```

### 3. Confirmación de Acceso
Una vez que reciba confirmación del soporte técnico:
1. Vaya a `https://su-sitio-web.com/login`
2. Inicie sesión con sus credenciales
3. Navegue a `https://su-sitio-web.com/admin`
4. Debería ver el panel de administración completo

### 4. Primeros Pasos Post-Configuración
1. **Cambiar contraseña** (si usó una temporal)
2. **Leer el manual completo** (`MANUAL_ADMINISTRACION.md`)
3. **Probar subida de archivo Excel** para verificar funcionalidad
4. **Guardar contactos de soporte técnico**

---

## Para el Soporte Técnico

### Asignar Rol de Administrador
Para asignar el rol de administrador a un usuario registrado:

1. Identifique el ID del usuario en la tabla `easysite_auth_users`
2. Actualice el registro con:
   ```sql
   UPDATE easysite_auth_users 
   SET role_id = 1369, role_name = 'Administrator', role_code = 'Administrator'
   WHERE email = 'admin@publiexpert.com';
   ```

### Verificación
Confirme que el usuario puede:
- ✅ Acceder a `/admin`
- ✅ Ver información de administrador
- ✅ Subir archivos Excel
- ✅ Ver todas las secciones del panel

---

**Nota:** Este proceso garantiza que solo usuarios autorizados tengan acceso administrativo al sitio web.
