# Política de Seguridad

[English](SECURITY.md) · **Español**

## Versiones soportadas

Solo la última versión menor recibe correcciones de seguridad. Las correcciones salen como una nueva versión de parche en npm; el Worker alojado se redespliega desde `master`.

| Versión | Soportada          |
| ------- | ------------------ |
| 2.1.x   | :white_check_mark: |
| < 2.1   | :x:                |

## Reportar una vulnerabilidad

**No abras un issue público para una vulnerabilidad.**

Repórtala en privado mediante GitHub Security Advisories:

<https://github.com/georgegiosue/mcp-emtrafesa/security/advisories/new>

Si no puedes usar GitHub, escribe a <peraldonamoc@gmail.com> con `[security] mcp-emtrafesa` en el asunto.

Incluye lo que puedas: versión o endpoint afectado, pasos para reproducirlo, la petición y respuesta involucradas, y el impacto que crees que tiene. Una reproducción mínima vale más que el reporte de un escáner.

Qué esperar:

- **Acuse de recibo** en un plazo de 5 días hábiles.
- **Evaluación** —aceptado o rechazado, con motivos— en un plazo de 14 días.
- **Corrección** de un reporte aceptado tan pronto como sea posible, seguida de una versión de parche y un advisory publicado. Se te acredita salvo que pidas lo contrario.
- **Rechazo** con explicación. Motivos comunes: fuera de alcance (ver abajo), sin impacto real en un servidor de solo lectura sobre datos públicos, o el comportamiento pertenece al sitio de Emtrafesa.

Por favor, deja un plazo razonable antes de divulgar públicamente.

## Alcance

Dentro del alcance:

- El código fuente de este repositorio.
- El paquete npm `mcp-emtrafesa` y el binario que publica.
- El endpoint MCP alojado en `https://mcp-emtrafesa.georgegiosue.dev/mcp`.

Fuera del alcance:

- **`www.emtrafesa.pe` y cualquier sistema de Emtrafesa.** Este proyecto es un cliente no afiliado que lee su sitio web público. No pruebes, hagas fuzzing ni ataques la infraestructura de Emtrafesa: no soy quién para autorizarlo, y el volumen contra su sitio es lo único que puede cortarle el acceso a este proyecto. Las vulnerabilidades del sitio de Emtrafesa le corresponden a Emtrafesa; repórtalas allí.
- Problemas de la plataforma Cloudflare Workers (reportar a Cloudflare).
- Hallazgos que dependen de un host comprometido, de un cliente MCP malicioso que el propio usuario instaló, o de ejecutar el servidor con el código modificado.
- Falta de rate limiting o denegación de servicio contra el endpoint alojado mediante volumen ordinario de peticiones.
- Reportes generados por escáneres automáticos sin impacto demostrado.

## Qué maneja este servidor

Contexto para juzgar el impacto:

- El servidor es de **solo lectura**. Cada herramienta es un GET o un POST de consulta; nada crea, modifica ni cancela una reserva.
- **No hay autenticación ni estado de sesión.** El Worker corre stateless, con CORS abierto a `*` y sin credenciales: sirve datos públicos de transporte.
- **No se persiste nada.** Sin base de datos, sin logs de los argumentos de las herramientas, sin caché.
- `get-latest-purchased-tickets` recibe un **DNI y un correo**, y `get-ticket-pdf` recibe un código de boleto. Se reenvían al endpoint de consulta de Emtrafesa y el resultado se devuelve a quien llamó. El servidor no los almacena ni los registra. Quien tenga esos valores ya puede hacer la misma consulta en el sitio público de Emtrafesa, pero trátalos como datos personales al redactar un reporte y **nunca incluyas el DNI, correo o código de boleto real de un tercero**.
- El sexo del pasajero por asiento ocupado lo devuelve el endpoint del croquis y se elimina deliberadamente antes de que la respuesta salga de este servidor. Si encuentras una ruta por la que ese dato —o cualquier otro campo personal de terceros— llega al resultado de una herramienta, es un reporte válido.

## Nota sobre `certs/sectigo-r46.pem`

Ese archivo es un **certificado raíz de CA público**, versionado porque el trust store de workerd no lo incluye y sin él `wrangler dev` no puede llegar a `www.emtrafesa.pe`. No es un secreto, no contiene clave privada, está en `.npmignore` y nunca lo usa un Worker desplegado. Un escáner que lo marque como certificado versionado es un falso positivo.
