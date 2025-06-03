// 1. Definición de las palabras con su posición y dirección
//    NOTA: agregamos "CASAMOS" en (row:7, col:2, dir:"A") como primera palabra fija.
const palabras = [
  { text: "CASAMOS",     row: 7,  col: 2,  dir: "A" }, // 1. CASAMOS (fija en row 7, col 2, horizontal)
  { text: "RESERVA",     row: 1,  col: 2,  dir: "D" }, // 2. Reserva
  { text: "LA",          row: 6,  col: 4,  dir: "D" }, // 3. La
  { text: "FECHA",       row: 2,  col: 1,  dir: "A" }, // 4. Fecha
  { text: "VEINTISIETE", row: 1,  col: 7,  dir: "D" }, // 5. Veintisiete
  { text: "DICIEMBRE",   row: 11, col: 3,  dir: "A" }, // 6. Diciembre
  { text: "NOS",         row: 7,  col: 6,  dir: "D" }  // 7. Nos
];

// 2. Ajustar filas y columnas totales (aquí, 11×11)
const TOTAL_ROWS = 11;
const TOTAL_COLS = 11;

// 3. Creamos la matriz inicial vacía: cada celda con isLetter:false, sin número ni orientación.
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,   // si va a contener letra
      number: null,      // número de pista si es primera letra
      orientation: null  // "A" o "D"
    });
  }
  gridData.push(fila);
}

// 4. Rellenamos gridData con cada palabra
palabras.forEach((palabraObj, index) => {
  const { text, row, col, dir } = palabraObj;
  const numPista = index + 1; // numerar desde 1

  for (let i = 0; i < text.length; i++) {
    // Calcular fila (r) y columna (c) 1-based
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;

    // Marcar la celda como parte de palabra
    gridData[r - 1][c - 1].isLetter = true;

    if (i === 0) {
      // Primera letra: asignar número y orientación
      gridData[r - 1][c - 1].number = numPista;
      gridData[r - 1][c - 1].orientation = dir;
    } else {
      // Letras intermedias: si aún no tenían orientación, la asignamos
      if (!gridData[r - 1][c - 1].orientation) {
        gridData[r - 1][c - 1].orientation = dir;
      }
      // Si ya había orientación (intersección), mantenemos la existente.
    }
  }
});

// 5. Pintado del grid en el DOM
const contenedor = document.getElementById("crucigrama");

// Recorremos cada fila y columna para crear <div class="cell ...">
for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];
    const celdaDiv = document.createElement("div");

    if (!celdaInfo.isLetter) {
      // Celda que no forma parte de palabra: la marcamos como "blank"
      celdaDiv.classList.add("cell", "blank");
    } else {
      // Celda que sí contiene parte de una palabra
      celdaDiv.classList.add("cell");

      // Dependiendo de la orientación (vertical="D" o horizontal="A"), agregamos la clase
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      // Si esta celda es la primera letra (tiene número), insertamos <span class="number">
      if (celdaInfo.number !== null) {
        const spanNum = document.createElement("span");
        spanNum.classList.add("number");
        spanNum.textContent = celdaInfo.number;
        celdaDiv.appendChild(spanNum);
      }

      // Creamos el <input> donde el usuario colocará la letra
      const inputLetra = document.createElement("input");
      inputLetra.setAttribute("type", "text");
      inputLetra.setAttribute("maxlength", "1");
      // (opcional) Le damos un id para identificarla: "cell-fila-col"
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
