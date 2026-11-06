# getiomark | Desarrollo Frontend II (PFY2202)

Proyecto académico: **Evaluación Sumativa, Semana 3**. El sitio de gestión de inventario del supermercado **getiomark** continúa el trabajo presentado en las Semanas 1 y 2.

Autor: Alonso Guzmán.

## Funciones incluidas

### Se mantienen las funciones de las entregas anteriores

- Panel principal con estadísticas, alertas de existencias, búsqueda, ajuste manual del stock y exportación CSV.
- Pantallas «Quiénes somos» y «Contacto» y menú de navegación inferior.
- Pantallas «Ingresar artículo» y «Listado de artículos», con formulario, tabla, búsqueda, edición y eliminación.
- React Router, Context API y Tailwind CSS 3 para el diseño responsivo.
- Guardado de productos en el navegador mediante `localStorage` con la misma clave anterior, para conservar el inventario previo.

### Novedades de la Semana 3

1. **Filtro dinámico por categoría:** en «Listado de artículos» se puede seleccionar «Todas las categorías» o una categoría concreta. La tabla se actualiza al cambiar el filtro. La lista original se conserva porque se usa un resultado derivado del estado global, sin modificar el arreglo original.
2. **Pantalla de detalle de artículos:** el usuario puede pulsar el nombre o el ícono del ojo en el listado. Se muestran SKU, marca, tipo, categoría, proveedor, precio, stock disponible y stock mínimo.
3. **Agregar al carrito desde el detalle:** la cantidad seleccionada se descuenta inmediatamente del stock general. No se permite agregar más unidades de las disponibles ni comprar un artículo agotado.
4. **Pantalla «Carrito»:** se muestran los artículos seleccionados, sus cantidades, el precio unitario, el subtotal y el total referencial.
5. **Actualizar cantidades:** el botón `+` aumenta las unidades en el carrito y reduce el stock disponible. El botón `−` hace lo contrario. Si la cantidad llega a cero, la línea desaparece del carrito y las unidades regresan al inventario.
6. **Quitar o vaciar el carrito:** las unidades que estaban reservadas se devuelven automáticamente al inventario.
7. **Persistencia:** el carrito se conserva al actualizar la página. No se descuenta el stock por segunda vez cuando se recarga.
8. **Diseño adaptativo y estructura modular:** componentes y funciones independientes, manteniendo el estilo anterior de getiomark.

> Este es un proyecto académico de frontend. El carrito no procesa pagos reales y las existencias se guardan exclusivamente en el navegador de cada usuario.

## Requisitos y ejecución

- Node.js 20.19 o superior (recomendado Node.js 22).
- npm y un editor, por ejemplo Visual Studio Code.
- Acceso a internet la primera vez para instalar dependencias.

Desde la carpeta **getiomark** que contiene `package.json`, ejecutar:

```bash
npm install
npm run dev
```

Abrir la dirección que muestra Vite, generalmente `http://localhost:5173/`.

Comandos útiles:

```bash
npm test          # pruebas de datos, carrito, filtro y validaciones
npm run build     # crea la carpeta dist/ para publicación
npm run preview   # permite revisar la compilación de producción
```

## Páginas y rutas

| Página | Ruta local | Archivo |
| --- | --- | --- |
| Inicio / inventario | `/` | `src/pages/Dashboard.jsx` |
| Quiénes somos | `/quienes-somos` | `src/pages/About.jsx` |
| Contacto | `/contacto` | `src/pages/Contact.jsx` |
| Ingresar artículo | `/articulos/nuevo` | `src/pages/NewArticle.jsx` |
| Listado + filtro | `/articulos/listado` | `src/pages/ArticlesList.jsx` |
| Detalle de artículo | `/articulos/:id` | `src/pages/ArticleDetail.jsx` |
| Carrito de compras | `/carrito` | `src/pages/ShoppingCart.jsx` |

En local se usa `BrowserRouter`. Al compilar para **GitHub Pages**, se utiliza automáticamente `HashRouter`, para que los enlaces internos sigan funcionando aunque GitHub Pages no tenga un servidor React. En la web publicada las rutas se ven como `#/carrito` o `#/articulos/listado`.

## Cómo se sincronizan inventario y carrito

El proveedor `src/context/InventoryContext.jsx` administra `products` y `cart` en un mismo `useReducer`. Las reglas se definen en `src/utils/inventoryReducer.js`.

Cada artículo del carrito guarda solo `{ id, quantity }`. Los detalles de ese artículo se obtienen del inventario global, de manera que editar su nombre o precio se refleja también en el carrito.

- `ADD_TO_CART`: se reserva la cantidad elegida y se descuenta del producto.
- `CHANGE_CART_QUANTITY`: al subir el carrito se resta del stock; al bajarlo se devuelve.
- `REMOVE_FROM_CART`: devuelve todas las unidades de la línea eliminada.
- `CLEAR_CART`: devuelve todas las unidades de todas las líneas.
- `DELETE_PRODUCT`: elimina el producto del inventario y quita la posible línea del carrito.
- `filterProducts`: permite filtrar por categoría, búsqueda y estado, sin alterar el inventario.

Las funciones verifican que la cantidad sea entera y positiva y que no se reserve stock inexistente. De este modo, los cambios de carrito e inventario se realizan en **una sola transición de estado**.

El inventario usa la clave `getiomark-inventory-v1` (la misma que en las Semanas 1 y 2), mientras el carrito usa la nueva clave `getiomark-cart-v1`. Al recargar la página se recuperan ambos valores.

## Prueba manual sugerida para la presentación

1. Abre «Listado de artículos». Comprueba que aparecen los productos registrados.
2. Selecciona «Lácteos» y verifica que solo se muestran los productos de esa categoría. Luego selecciona «Todas las categorías»: vuelven a aparecer todos los artículos.
3. Haz clic en «Leche entera 1 L». Se abre su ficha con todos los datos y, al comenzar con datos limpios, **48 unidades disponibles**.
4. Selecciona **2 unidades** y pulsa «Agregar al carrito». La ficha mostrará **46 disponibles** y **2 en el carrito**.
5. Entra a «Carrito» y pulsa `+` junto a la leche. El carrito mostrará **3 unidades** y el inventario **45 disponibles**.
6. Pulsa `−`: el carrito vuelve a **2 unidades** y el inventario a **46 disponibles**.
7. Quita la leche del carrito. El stock vuelve a **48**.
8. Agrega un artículo nuevamente y recarga el navegador. Verifica que se conserva el carrito y el stock descontado.
9. Registra un artículo nuevo desde «Ingresar artículo» y comprueba que aparece en el listado y que se puede comprar desde su detalle.

Si ya tienes datos de semanas anteriores en ese navegador, los valores de stock inicial pueden ser distintos: el sistema mantiene las existencias guardadas.

## Estructura principal

```text
getiomark/
├── .github/
│   └── workflows/
│       └── deploy.yml             # despliegue automático a GitHub Pages
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── ProductModal.jsx
│   ├── context/
│   │   └── InventoryContext.jsx    # estado global compartido
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── NewArticle.jsx
│   │   ├── ArticlesList.jsx        # filtro + enlaces a detalles
│   │   ├── ArticleDetail.jsx      # nuevo en Semana 3
│   │   └── ShoppingCart.jsx       # nuevo en Semana 3
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── utils/
│   │   ├── inventory.js           # almacenamiento del inventario/carrito y CSV
│   │   ├── inventoryReducer.js    # reglas puras y filtros
│   │   └── productValidation.js
│   ├── App.jsx                    # menús y rutas React
│   └── main.jsx                   # router y provider
├── tests/
│   ├── inventory.test.js          # tests heredados
│   └── cart.test.js               # tests agregados
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vite.config.js
└── README.md
```

## Criterios de la pauta sumativa

| Criterio | Puntaje máximo | Archivo principal |
| --- | ---: | --- |
| Pantalla de listado con datos completos | 15 | `ArticlesList.jsx` |
| Filtro dinámico sin pérdida de datos | 15 | `ArticlesList.jsx`, `inventoryReducer.js` |
| Pantalla de detalle e interacción | 15 | `ArticleDetail.jsx` |
| Modificación de inventario al comprar o cambiar el carrito | 15 | `ShoppingCart.jsx`, `inventoryReducer.js` |
| Framework CSS y diseño responsivo | 15 | `tailwind.config.cjs`, archivos `src/styles/` y páginas |
| Código modular y reutilizable | 15 | `context/`, `utils/`, `pages/` |
| GitHub, documentación y GitHub Pages | 10 | `README.md`, `.github/workflows/deploy.yml` |
| **Total** | **100** | |

La publicación efectiva en GitHub Pages debe realizarla el estudiante desde su cuenta de GitHub para completar el último criterio.

## Publicar en GitHub y GitHub Pages

El formato solicitado para el repositorio es:

`supermercado-alonso-guzman-PFY2202`

**Si aún no has creado un repositorio**:

1. Crea un repositorio de GitHub con ese nombre.
2. Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Semana 3: filtro, detalles y carrito getiomark"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/supermercado-alonso-guzman-PFY2202.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu usuario real de GitHub.

**Si ya tienes el proyecto en GitHub**, conserva tu carpeta `.git`, actualiza sus archivos con esta entrega y ejecuta:

```bash
git add .
git commit -m "Semana 3: carrito y detalle de articulos"
git push
```

**Activar GitHub Pages:**

1. En GitHub entra al repositorio y abre **Settings → Pages**.
2. En la sección **Build and deployment**, elige **GitHub Actions** como fuente de publicación.
3. Ve a la pestaña **Actions** para revisar la ejecución de «Publicar getiomark en GitHub Pages».
4. Cuando termine correctamente, accede a la web publicada, cuya dirección normalmente tendrá el formato:
   `https://TU-USUARIO.github.io/supermercado-alonso-guzman-PFY2202/`
5. Entrega al docente el enlace del **repositorio** y el de **GitHub Pages**.

El workflow incluido ejecuta `npm install`, `npm test`, `npm run build` y publica `dist/` automáticamente cada vez que se suben cambios a `main`. La configuración de Vite determina la ruta base desde el nombre real del repositorio y permite que los recursos CSS/JS se carguen correctamente en GitHub Pages.

## Limitaciones

- Es una demostración académica, sin servidor, cuentas reales, pagos, ni sincronización entre dispositivos.
- Los datos se guardan en `localStorage` del navegador utilizado. Borrar los datos del sitio elimina los productos guardados y el carrito.
- Se incluye el código y las pruebas, pero es necesario instalar las dependencias para iniciar Vite y verificar la interfaz en el computador del estudiante.
