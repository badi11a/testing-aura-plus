# Estado del Proyecto — Aura+
**Fecha:** 2026-06-06  
**Versión:** Prototipo académico frontend (post-refactor arquitectónico)

---

## Descripción general

Aura+ es una billetera digital simulada, implementada íntegramente como frontend estático. No cuenta con backend ni servidor; toda la lógica de negocio y el estado de la aplicación residen en el navegador mediante `localStorage`.

---

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| Lenguaje | HTML5 + CSS3 + JavaScript (ES6) |
| Framework CSS | Bootstrap 5.3.0 (CDN) |
| Librería JS | jQuery 3.6.0 (CDN) |
| Iconografía | Font Awesome 6.4.0 (CDN) |
| Persistencia | `localStorage` del navegador |
| Backend | Ninguno |
| Base de datos | Ninguna |

---

## Estructura de archivos

```
testing-aura-plus/
├── index.html              Landing page
├── login.html              Formulario de autenticación
├── menu.html               Dashboard principal
├── deposit.html            Formulario de depósito
├── sendmoney.html          Contactos y transferencias
├── transactions.html       Historial de movimientos
├── aura.css                Estilos compartidos de toda la app
└── js/
    ├── config.js           Constantes de negocio (montos, límites, locale, credenciales)
    ├── storage.js          Capa de datos: toda operación sobre localStorage
    ├── validators.js       Validaciones puras: RUT, monto, nombre, número de cuenta
    ├── ui.js               Utilidades de UI: formatCLP, mostrarError, mostrarExito, escape
    └── auth.js             Guardia de ruta y logout centralizado
```

---

## Arquitectura de módulos JS

La lógica está separada en capas con dependencias unidireccionales:

```
config.js
    ├─→ storage.js    (usa AURA_CONFIG.HISTORIAL_MAX, LOCALE)
    └─→ validators.js (usa AURA_CONFIG.MONTO_MAXIMO, LOCALE)

ui.js               (usa AURA_CONFIG.LOCALE a través de formatCLP)
auth.js             (usa AuraStorage)
```

Cada página HTML carga los 5 módulos en orden y sólo contiene lógica de presentación específica de esa vista.

---

## Modelo de datos (localStorage)

| Clave | Tipo | Contenido |
|---|---|---|
| `auraUsuario` | `string` | Email del usuario autenticado. Presencia = sesión activa |
| `auraSaldo` | `string` | Saldo actual en CLP como entero (ej: `"150000"`) |
| `auraHistorial` | `string` (JSON) | Array de objetos movimiento, ordenado del más reciente al más antiguo, máximo 100 entradas |
| `auraContactos` | `string` (JSON) | Array de objetos contacto con id, nombre, rut, banco, tipo, numero |

### Estructura de un movimiento
```json
{
  "tipo": "Depósito" | "Transferencia",
  "descripcion": "string",
  "monto": "string (entero)",
  "fecha": "DD-MM-YYYY",
  "esIngreso": true | false
}
```

### Estructura de un contacto
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "rut": "12.345.678-9",
  "banco": "Banco Estado",
  "tipo": "Cuenta Corriente",
  "numero": "123456789"
}
```

### Contactos predefinidos al inicio
La app inicializa 3 contactos de ejemplo si `auraContactos` no existe:
- Juan Pérez — RUT 12.345.678-9 — Banco Estado
- María González — RUT 9.876.543-2 — Banco de Chile
- Carlos Tapia — RUT 15.111.222-3 — Santander

---

## Credenciales de acceso

| Campo | Valor |
|---|---|
| Email | `usuario@aura.com` |
| Contraseña | `123456` |

> Las credenciales están definidas en `js/config.js` como `AURA_CONFIG.CREDENCIALES`. Continúan siendo texto plano por la ausencia de backend; cambiar a un servidor real requeriría migración de arquitectura.

---

## Inventario de funcionalidades

### Autenticación (`login.html`)
- Valida contra `AURA_CONFIG.CREDENCIALES` (centralizado en `config.js`)
- Al autenticar exitosamente: usa `AuraStorage.setUsuario()` y redirige a `menu.html`
- Mensajes de error en español vía `AuraUI.mostrarError()`

### Dashboard (`menu.html`)
- Muestra saldo con `AuraUI.formatCLP(AuraStorage.getSaldo())`
- Cierre de sesión delegado a `AuraAuth.logout()`

### Depósito (`deposit.html`)
- Validación de monto delegada a `AuraValidators.validarMonto()`
- Modal de confirmación antes de registrar
- Persiste mediante `AuraStorage.setSaldo()` y `AuraStorage.pushMovimiento()`

### Envío de dinero (`sendmoney.html`)
- Lista de contactos construida con DOM jQuery (sin innerHTML con datos de usuario)
- Eventos de "Enviar" y "Eliminar" por delegación con `data-id` (sin onclick inline)
- Validación de monto, RUT, nombre y número de cuenta usando `AuraValidators`
- Persiste transferencia y contactos mediante `AuraStorage`

### Historial (`transactions.html`)
- Construye la lista con DOM jQuery (sin innerHTML con datos de usuario)
- Muestra saldo con `AuraUI.formatCLP()`

---

## Controles de seguridad implementados

| Control | Implementación | Ubicación |
|---|---|---|
| Route guard | `AuraAuth.requireSesion()` al cargar cada página protegida | `auth.js` |
| Logout completo | `AuraAuth.logout()` elimina usuario, saldo e historial | `auth.js` |
| Resistencia a corrupción de localStorage | `try/catch` en todos los reads de JSON | `storage.js` |
| Escape de HTML | `AuraUI.escape()` — construcción del DOM con `.text()` / `createTextNode` | `ui.js`, `sendmoney.html`, `transactions.html` |
| Sin onclick inline con datos de usuario | Delegación de eventos con `data-id` en lugar de `onclick="f('${nombre}')"` | `sendmoney.html` |

---

## Validaciones implementadas

| Campo | Regla | Módulo |
|---|---|---|
| Monto depósito | Entero positivo, máximo `AURA_CONFIG.MONTO_MAXIMO` | `validators.js` |
| Monto transferencia | Entero positivo, máximo, menor o igual al saldo | `validators.js` |
| Nombre de contacto | Solo letras (a-z, á-ú, ñ) y espacios | `validators.js` |
| RUT | Formato y dígito verificador (módulo 11) | `validators.js` |
| Número de cuenta | Solo dígitos (`/^\d+$/`) | `validators.js` |
| Duplicado de contacto | Compara RUTs normalizados (sin puntos ni guión) | `sendmoney.html` |
| Historial | Limitado a `AURA_CONFIG.HISTORIAL_MAX` entradas | `storage.js` |
| Mensajes de validación | Sobreescritos en español con `setCustomValidity` | cada HTML |

---

## Constantes de negocio (`js/config.js`)

| Constante | Valor | Uso |
|---|---|---|
| `AURA_CONFIG.MONTO_MAXIMO` | `10000000` | Límite de depósito y transferencia |
| `AURA_CONFIG.HISTORIAL_MAX` | `100` | Máximo de entradas en historial |
| `AURA_CONFIG.LOCALE` | `'es-CL'` | Formato de fecha y moneda |
| `AURA_CONFIG.CREDENCIALES` | `{ email, password }` | Credenciales de demo |

---

## Limitaciones conocidas (fuera de scope del prototipo)

| Limitación | Razón |
|---|---|
| Credenciales en texto plano | Sin backend, no hay alternativa real; requeriría migración de arquitectura |
| localStorage sin cifrado | La clave de cifrado también estaría en el JS; ofuscar no resuelve el problema de raíz |
| Sin autenticación real | La "sesión" es simplemente la presencia de una clave en localStorage |
| Manipulación de saldo por consola | Cualquier usuario puede editar `auraSaldo` directamente en DevTools |
| Sin pruebas automatizadas | Las pruebas fueron manuales durante QA |
| `auraContactos` persiste entre sesiones | Decisión de diseño: los contactos son de la agenda, no datos financieros de sesión |

---

## Flujo de navegación

```
index.html
    └─→ login.html (credenciales: usuario@aura.com / 123456)
            └─→ menu.html [PROTEGIDA]
                    ├─→ deposit.html       [PROTEGIDA]
                    ├─→ sendmoney.html     [PROTEGIDA]
                    └─→ transactions.html  [PROTEGIDA]
```

---

## Historial de versiones

| Versión | Fecha | Descripción |
|---|---|---|
| Prototipo inicial | — | HTML + CSS + JS inline, sin separación de capas |
| Post-mejoras QA | 2026-06-06 | Correcciones de validación y UX |
| Post-refactor arquitectónico | 2026-06-06 | Extracción de módulos JS, CSS unificado, corrección de XSS |
