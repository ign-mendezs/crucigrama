# Crucigrama Interactivo (GitHub Pages)

Este repositorio contiene un crucigrama interactivo que se despliega “desde cero” usando HTML, CSS y JavaScript puro. No utiliza una imagen de fondo; en su lugar, se pinta un grid de 11×11 donde solo aparecen las celdas involucradas en las palabras.

- **Verticales** en color rosado.
- **Horizontales** en color verde.
- Las letras ingresadas se ven en color negro.
- Las pistas van en una lista numerada, sin separar horizontales/verticales, sino simplemente identificadas por el número de su casilla inicial.

Para publicar en GitHub Pages:

1. Sube todo este repositorio a un repo nuevo en GitHub (por ejemplo, `mi-crucigrama`).
2. Ve a “Settings” → “Pages” y elige la rama `main` (o `master`) y carpeta `/ (root)`.
3. Guarda; GitHub generará una URL del tipo `https://<tu-usuario>.github.io/mi-crucigrama/`.

Lista de palabras (en `js/script.js`):

```js
const palabras = [
  { text: "RESERVA",     row: 1,  col: 2,  dir: "D" }, // 1. Reserva
  { text: "LA",          row: 6,  col: 4,  dir: "D" }, // 2. La
  { text: "FECHA",       row: 2,  col: 1,  dir: "A" }, // 3. Fecha
  { text: "VEINTISIETE", row: 1,  col: 7, dir: "D" }, // 4. Veintisiete
  { text: "DICIEMBRE",   row: 11, col: 3,  dir: "A" }, // 5. Diciembre
  { text: "NOS",         row: 7,  col: 6, dir: "D" }  // 6. Nos
];
