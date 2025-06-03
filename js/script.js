// 1. Definición de las palabras con su posición y dirección
const palabras = [
  { text: "RESERVA",     row: 1,  col: 2,  dir: "D" }, // 1. Reserva
  { text: "LA",          row: 6,  col: 4,  dir: "D" }, // 2. La
  { text: "FECHA",       row: 2,  col: 1,  dir: "A" }, // 3. Fecha
  { text: "VEINTISIETE", row: 1,  col: 7, dir: "D" }, // 4. Veintisiete
  { text: "DICIEMBRE",   row: 11, col: 3,  dir: "A" }, // 5. Diciembre
  { text: "NOS",         row: 7,  col: 6, dir: "D" }  // 6. Nos
];

// 2. Determinar tamaño del grid: 11 filas x 11 columnas (hardcodeado según tus datos)
const TOTAL_ROWS = 11;
const TOTAL_COLS = 11;

// 3. Generar una matriz inicializada con celdas “vacías”
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,   // si forma parte de una palabra
      number: null,      // número de pista si corresponde
      orientation: null  // "A" o "D"
    });
  }
  gridData.push(fila);
}

// 4. Rellenar gridData con cada palabra
palabras.forEach((palabraObj, index) => {
  const { text, row, col, dir } = palabraObj;
  const numPista = index + 1; // numeración empezando en 1

  for (let i = 0; i < text.length; i++) {
    // Calcular fila y columna según dirección
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;

    // Marcar la celda como parte de palabra
    gridData[r - 1][c - 1].isLetter = true;
    // Si es la primera letra, asignar número y orientación
    if (i === 0) {
      gridData[r - 1][c - 1].number = numPista;
      gridData[r - 1][c - 1].orientation = dir;
    } else {
      // Para letras intermedias, solo asignar orientación si aún no existe
      if (!gridData[r - 1][c - 1].orientation) {
        gridData[r - 1][c - 1].orientation = dir;
      }
      // Si ya tenía otra orientación (intersección), dejamos la primera (vertical o horizontal según haya llegado primero)
    }
  }
});

// 5. Pintar el grid en el DOM
const contenedor = document.getElementById("crucigrama");

for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];
    const celdaDiv = document.createElement("div");

    if (!celdaInfo.isLetter) {
      // Celda en blanco
      celdaDiv.classList.add("cell", "blank");
    } else {
      // Celda que forma parte de palabra
      celdaDiv.classList.add("cell");
      // Asignar color según orientación (vertical=u "D" o horizontal="A")
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      // Si hay número, agregar <span> con el número en esquina
      if (celdaInfo.number !== null) {
        const spanNum = document.createElement("span");
        spanNum.classList.add("number");
        spanNum.textContent = celdaInfo.number;
        celdaDiv.appendChild(spanNum);
      }

      // Crear input para que el usuario escriba la letra
      const inputLetra = document.createElement("input");
      inputLetra.setAttribute("type", "text");
      inputLetra.setAttribute("maxlength", "1");
      // Opcional: darle un id para identificarlo, p.ej: "cell-3-5"
      inputLetra.id = `cell-${fila + 1}-${col + 1}`;
      celdaDiv.appendChild(inputLetra);
    }

    contenedor.appendChild(celdaDiv);
  }
}

// 6. Generar la lista de pistas numerada
const listaPistas = document.getElementById("lista-pistas");
palabras.forEach((palabraObj, index) => {
  const li = document.createElement("li");
  const num = index + 1;
  li.innerHTML = `<strong>${num}.</strong> ${palabraObj.text}`;
  listaPistas.appendChild(li);
});
