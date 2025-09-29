# Manual de Administración del Sitio Web
## Guía Completa para Administradores

### 📋 Índice
1. [Acceso al Panel de Administración](#acceso-al-panel-de-administración)
2. [Credenciales del Administrador](#credenciales-del-administrador)
3. [Funcionalidades del Panel](#funcionalidades-del-panel)
4. [Gestión de Contenido](#gestión-de-contenido)
5. [Subida de Datos Financieros](#subida-de-datos-financieros)
6. [Gestión de Traducciones](#gestión-de-traducciones)
7. [Mantenimiento Básico](#mantenimiento-básico)
8. [Solución de Problemas](#solución-de-problemas)
9. [Contacto Técnico](#contacto-técnico)

---

## 🔐 Acceso al Panel de Administración

### URL de Acceso
Para acceder al panel de administración, visite:
```
https://su-sitio-web.com/admin
```

### Proceso de Inicio de Sesión
1. Vaya a la página de login: `https://su-sitio-web.com/login`
2. Ingrese sus credenciales de administrador
3. Haga clic en "Iniciar Sesión"
4. Una vez autenticado, navegue a `/admin` o use el menú de navegación

---

## 👤 Credenciales del Administrador

### Usuario Administrador Predeterminado
- **Email:** `admin@publiexpert.com`
- **Contraseña:** `Admin123!`
- **Rol:** Administrador
- **Permisos:** Acceso completo al panel de administración

> ⚠️ **IMPORTANTE:** Cambie la contraseña predeterminada inmediatamente después del primer inicio de sesión por seguridad.

### Cambio de Contraseña
1. Inicie sesión en el sitio web
2. Vaya a su perfil de usuario
3. Seleccione "Cambiar Contraseña"
4. Ingrese la contraseña actual y la nueva contraseña
5. Confirme los cambios

---

## 🎛️ Funcionalidades del Panel

### Secciones Principales
El panel de administración incluye las siguientes secciones:

#### 1. **Información del Administrador**
- Muestra datos del usuario actual
- Confirma permisos de administrador
- Información de la cuenta

#### 2. **Subida de Datos Financieros**
- Carga masiva de archivos Excel
- Validación automática de datos
- Gestión de datasets financieros

#### 3. **Documentación**
- Enlaces a recursos de ayuda
- Guías de uso rápido
- Información de mantenimiento

---

## 📝 Gestión de Contenido

### Modificación de Textos
Para cambiar el contenido del sitio web:

#### Método 1: Archivos de Traducción
1. Los textos se encuentran en:
   - `src/locales/es/translation.json` (Español)
   - `src/locales/en/translation.json` (Inglés)

2. Edite los archivos directamente para cambiar textos
3. Los cambios se reflejan automáticamente

#### Método 2: A través del Código
1. Los componentes principales están en `src/components/`
2. Las páginas principales están en `src/pages/`
3. Edite directamente los archivos `.tsx` para cambios específicos

### Secciones Principales del Sitio
- **Hero Section:** `src/components/home/HeroSection.tsx`
- **Servicios:** `src/components/home/ServicesSection.tsx`
- **Insights de Mercado:** `src/components/home/MarketInsights.tsx`
- **Reportes Destacados:** `src/components/home/FeaturedReports.tsx`
- **Información de Empresa:** `src/components/home/CompanyInfo.tsx`
- **Contacto:** `src/components/home/ContactSection.tsx`

---

## 📊 Subida de Datos Financieros

### Formato de Archivos Requerido
- **Tipos permitidos:** `.xlsx`, `.xls`
- **Estructura:** Primera hoja será procesada
- **Encoding:** UTF-8 recomendado

### Proceso de Subida
1. Acceda al panel de administración
2. Vaya a la sección "Subir Datos Financieros"
3. Complete los campos:
   - **Nombre del Dataset:** Identificador único
   - **Descripción:** Descripción opcional del dataset
   - **Es Premium:** Marque si el dataset requiere suscripción premium
4. Seleccione el archivo Excel
5. Haga clic en "Subir Archivo"
6. Espere la confirmación de éxito

### Validaciones Automáticas
El sistema valida:
- Formato de archivo correcto
- Contenido no vacío
- Estructura de datos válida
- Duplicación de nombres de dataset

### Estados del Dataset
- ✅ **Subido Exitosamente:** Dataset disponible para usuarios
- ❌ **Error:** Revise el formato y contenido del archivo
- ⏳ **Procesando:** Archivo en proceso de validación

---

## 🌐 Gestión de Traducciones

### Estructura de Traducción
El sitio es bilingüe (Español/Inglés) con archivos separados:

#### Archivos de Traducción
```
src/locales/
├── es/
│   └── translation.json    # Traducciones en español
└── en/
    └── translation.json    # Traducciones en inglés
```

### Añadir Nuevas Traducciones
1. Abra el archivo de traducción correspondiente
2. Añada nuevas claves siguiendo la estructura JSON:
```json
{
  "seccion": {
    "clave": "Texto en español",
    "otraClave": "Otro texto"
  }
}
```
3. Use las claves en componentes con `t('seccion.clave')`

### Cambio de Idioma por Defecto
En `src/i18n/index.ts`, modifique:
```javascript
lng: localStorage.getItem('language') || 'es', // 'es' o 'en'
```

---

## 🔧 Mantenimiento Básico

### Tareas Regulares Recomendadas

#### Semanal
- [ ] Verificar funcionamiento del panel de administración
- [ ] Revisar nuevos datasets subidos
- [ ] Comprobar logs de errores

#### Mensual
- [ ] Actualizar contenido si es necesario
- [ ] Revisar y limpiar datasets obsoletos
- [ ] Verificar performance del sitio web

#### Trimestral
- [ ] Actualizar dependencias del proyecto
- [ ] Revisar y actualizar documentación
- [ ] Backup completo de la base de datos

### Comandos Útiles
Si tiene acceso al servidor, puede usar:

```bash
# Ver logs de aplicación
tail -f logs/application.log

# Reiniciar aplicación (si es necesario)
npm run build
npm start

# Verificar estado de la base de datos
# (Contacte soporte técnico para esto)
```

---

## 🚨 Solución de Problemas

### Problemas Comunes

#### 1. **No puedo acceder al panel de administración**
**Posibles causas:**
- Credenciales incorrectas
- Rol de usuario no es administrador
- Problemas de conexión

**Soluciones:**
- Verifique email y contraseña
- Contacte soporte para verificar permisos
- Pruebe desde otra conexión/dispositivo

#### 2. **Error al subir archivos Excel**
**Posibles causas:**
- Archivo corrupto o con formato incorrecto
- Tamaño de archivo muy grande
- Conexión inestable

**Soluciones:**
- Verifique que el archivo Excel no esté dañado
- Intente con un archivo más pequeño
- Use una conexión estable

#### 3. **Cambios no se reflejan en el sitio**
**Posibles causas:**
- Cache del navegador
- Cache del servidor
- Errores de sintaxis

**Soluciones:**
- Limpie cache del navegador (Ctrl+Shift+R)
- Espere unos minutos para propagación
- Verifique sintaxis en archivos modificados

#### 4. **Problema con traducciones**
**Posibles causas:**
- Error de sintaxis en JSON
- Clave de traducción no encontrada
- Archivo de traducción corrupto

**Soluciones:**
- Valide sintaxis JSON online
- Verifique que la clave existe en ambos idiomas
- Restaure backup del archivo de traducción

---

## 📞 Contacto Técnico

### Soporte Técnico
- **Email:** nathan@publiexpert.com
- **Horario:** Lunes a Viernes, 9:00 AM - 6:00 PM
- **Tiempo de respuesta:** 24-48 horas

### Información a Incluir en Solicitudes de Soporte
1. **Descripción del problema:** Detalle específico del issue
2. **Pasos para reproducir:** Cómo llegó al problema
3. **Capturas de pantalla:** Si es relevante
4. **Mensaje de error:** Texto exacto del error
5. **Navegador y versión:** Información del navegador usado
6. **Fecha y hora:** Cuándo ocurrió el problema

### Emergencias
Para problemas críticos que afecten la operación del sitio:
- **Email urgente:** nathan@publiexpert.com (marcar como URGENTE)
- **Descripción:** Incluya impacto y criticidad

---

## ✅ Lista de Verificación Post-Configuración

Después de recibir acceso administrativo, verifique:

- [ ] Puede acceder al panel de administración
- [ ] Cambió la contraseña predeterminada
- [ ] Puede subir archivos Excel exitosamente
- [ ] Puede ver y modificar traducciones
- [ ] Comprende el proceso de gestión de contenido
- [ ] Tiene contacto de soporte técnico guardado
- [ ] Ha leído completamente este manual

---

## 📚 Recursos Adicionales

### Documentación Técnica
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **Tailwind CSS:** https://tailwindcss.com/

### Herramientas Recomendadas
- **Visual Studio Code:** Editor de código recomendado
- **JSON Validator:** Para validar archivos de traducción
- **Excel/LibreOffice Calc:** Para preparar datasets

---

*Este manual fue creado para facilitar la administración del sitio web. Para preguntas específicas o actualizaciones de este documento, contacte al soporte técnico.*

**Versión del Manual:** 1.0  
**Fecha de Creación:** Diciembre 2024  
**Última Actualización:** Diciembre 2024
