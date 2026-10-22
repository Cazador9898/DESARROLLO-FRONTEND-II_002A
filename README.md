# getiomark

**getiomark** es un sitio de gestión de inventario para supermercados construido con **HTML, CSS, JavaScript, React y React Router**.

Proyecto académico para la asignatura **Desarrollo Frontend II (PFY2202), Semana 1**, de acuerdo con las instrucciones de la **Evaluación Formativa 1**.

## 1. Funciones incluidas

- **Página principal (`/`)**: panel de inventario con datos de ejemplo.
- **Página «Quiénes somos» (`/quienes-somos`)**: información sobre getiomark.
- **Página «Contacto» (`/contacto`)**: formulario de contacto demostrativo.
- **Menú inferior fijo**: permite navegar entre las tres páginas con **React Router** sin recargar el sitio.
- Estadísticas: total de productos, unidades, valor estimado y alertas por stock.
- Inventario: crear, editar, eliminar, buscar y filtrar productos.
- Botones para aumentar o disminuir existencias.
- Exportar a CSV compatible con Excel (separador `;`, codificación UTF-8 BOM).
- Diseño adaptable a celulares, tabletas y computadores.
- Almacenamiento local (`localStorage`) para conservar los productos entre recargas del navegador.

> **Importante:** no existe un backend ni una base de datos remota. Los cambios de inventario y los mensajes del formulario se almacenan **únicamente en el navegador y dispositivo donde se utiliza la página**. El formulario de contacto no envía correos. Se utiliza con fines académicos.

## 2. Requisitos

- [Node.js](https://nodejs.org/) versión 18 o superior (recomendado: 20 o 22).
- Editor de código como Visual Studio Code.
- Una terminal (PowerShell o terminal integrada de VS Code).

## 3. Cómo ejecutar el proyecto

1. Descomprime el archivo ZIP.
2. Abre la carpeta `getiomark` en Visual Studio Code.
3. Abre una terminal en dicha carpeta.
4. Ejecuta:

```bash
npm install
npm run dev
```

5. Abre en tu navegador la dirección que indique Vite, normalmente **http://localhost:5173/**.

Para generar una versión de producción:

```bash
npm run build
```

Se creará la carpeta `dist/`.

## 4. Organización de carpetas

```text
getiomark/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── ProductModal.jsx
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── inventory.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 5. React Router

En `src/main.jsx` se utiliza `<BrowserRouter>` para envolver la aplicación. En `src/App.jsx` se configuran las rutas con `<Routes>` y `<Route>` y el menú inferior usa `<NavLink>`.

| Pantalla | Ruta | Archivo |
|---|---|---|
| Inventario | `/` | `Dashboard.jsx` |
| Quiénes somos | `/quienes-somos` | `About.jsx` |
| Contacto | `/contacto` | `Contact.jsx` |

## 6. Publicación en GitHub (requerimiento de la pauta)

La actividad solicita un repositorio público o accesible para el docente con el nombre:

`supermercado-nombre-apellido-siglaCurso`

Sustituye `nombre`, `apellido` y `siglaCurso` por tus datos y la sigla indicada por el profesor (por ejemplo `PFY2202`, si corresponde). **El nombre del sitio sigue siendo getiomark**; el nombre del repositorio es independiente.

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Proyecto getiomark con React Router"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/supermercado-nombre-apellido-siglaCurso.git
git push -u origin main
```

**Antes de `git remote add origin`:** crea un repositorio vacío con ese nombre desde la web de GitHub y reemplaza la URL de ejemplo por la real. Después envía la dirección del repositorio a tu docente.

## 7. Relación con la pauta

| Solicitud | Implementación |
|---|---|
| HTML, CSS, JavaScript y React | `index.html`, `index.css`, componentes `.jsx` |
| Home de inventario para supermercado | `Dashboard.jsx` |
| Dos páginas adicionales seleccionadas de la lista | `About.jsx` y `Contact.jsx` |
| Menú inferior de navegación | `BottomNav()` en `App.jsx` |
| Configuración de React Router | `main.jsx` y `App.jsx` |
| Repositorio GitHub para entrega | Publicar siguiendo el punto 6 |

## 8. Datos de ejemplo

El catálogo inicia con **12 productos demostrativos**, que puedes modificar libremente. Si quieres restaurarlos, abre las herramientas de desarrollo del navegador, ve a *Application/Almacenamiento > Local Storage* y elimina la entrada `getiomark-inventory-v1`. Al recargar, volverán a mostrarse los datos de ejemplo.
