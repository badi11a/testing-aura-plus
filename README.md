# Aura+

Aura+ es una billetera digital frontend que permite gestionar saldo, depósitos, transferencias y movimientos desde el navegador. La aplicación funciona sin backend y persiste la información en localStorage.

## Descripción

Aura+ ofrece una experiencia simple para administrar dinero digital en CLP (sin decimales), con interfaz moderna y navegación entre módulos de inicio de sesión, menú principal, depósito, envío de dinero e historial.

## Funcionalidades

- Inicio de sesión con validación de credenciales
- Visualización de saldo actual en CLP
- Depósito de dinero
- Transferencia de dinero a contactos
- Gestión de contactos (agregar, buscar y eliminar)
- Registro de movimientos (depósitos y transferencias)
- Persistencia local con localStorage

## Stack Tecnológico

- HTML5
- CSS3
- JavaScript (ES6)
- jQuery
- Bootstrap 5
- Font Awesome
- localStorage (Web Storage API)

## Cómo usar

1. Abre index.html en tu navegador.
2. Ingresa a la pantalla de login.
3. Inicia sesión con las credenciales de demo.
4. Desde el menú principal, elige una acción:
   - Depositar
   - Enviar dinero
   - Revisar movimientos
5. Usa el botón "Volver al Menú" para navegar entre módulos.

## Credenciales de demo

Estas credenciales son solo para pruebas:

- Email: usuario@aura.com
- Contraseña: 123456

## Estructura de archivos

- index.html: portada de la aplicación
- login.html: inicio de sesión
- menu.html: menú principal con saldo y accesos
- deposit.html: formulario de depósito
- sendmoney.html: gestión de contactos y transferencias
- transactions.html: historial de movimientos

## Claves de localStorage

- auraUsuario: email del usuario autenticado
- auraSaldo: saldo actual (entero en CLP)
- auraHistorial: lista de movimientos
- auraContactos: lista de contactos guardados

## Licencia

Este proyecto está bajo la licencia MIT.
