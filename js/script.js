// 1. Definimos DOS listas de palabras:
//    a) fixedWords: palabras que aparecen fijas (no editables). Aquí sólo "CASAMOS".
//    b) palabras: las palabras que el usuario debe resolver (editable con inputs),
//       numeradas del 1 al 6. A cada una le daremos una pista descriptiva más abajo.

const fixedWords = [
  // "CASAMOS" aparece fija en fila 7, columna 2, dirección horizontal ("A")
  { text: "CASAMOS", row: 7, col: 2, dir: "A" }
];

const palabras = [
  // Estas son las 6 palabras que el usuario debe rellenar, con sus posiciones.
  { text: "RESERVA",     row: 1,  col: 2,  dir: "D" }, // pista 1
  { text: "LA",          row: 6,  col: 4,  dir: "D" }, // pista 2
  { text: "FECHA",       row: 2,  col: 1,  dir: "A" }, // pista 3
  { text: "VEINTISIETE", row: 1,  col: 7,  dir: "D" }, // pista 4
  { text: "DICIEMBRE",   row: 11, col: 3,  dir: "A" }, // pista 5
  { text: "NOS",         row: 7,  col: 6,  dir: "D" }  // pista 6
];

// 2. Definimos el tamaño total del crucigrama: 11 filas x 11 columnas
const TOTAL_ROWS = 11;
const TOTAL_COLS = 11;

// 3. Inicializamos gridData (matriz 11×11) con celdas vacías
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,   // si formará parte de palabra (fija o a resolver)
      number: null,      // número de pista (solo para palabras a resolver)
      orientation: null, // "A" u "D"
      fixedChar: null    // si es parte de fixedWords, almacenamos la letra
    });
  }
  gridData.push(fila);
}

// 4. Marcamos en gridData las celdas correspondientes a fixedWords (CASAMOS)
//    No asignamos número ni input: sólo guardamos fixedChar = letra.
fixedWords.forEach(wordObj => {
  const { text, row, col, dir } = wordObj;
  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    // Colocamos la letra fija
    gridData[r - 1][c - 1].isLetter = true;
    gridData[r - 1][c - 1].orientation = dir;      // para pintar color
    gridData[r - 1][c - 1].fixedChar = text[i];    // la letra que se mostrará sin input
  }
});

// 5. Marcamos en gridData las celdas correspondientes a las palabras a resolver
//    A cada primera letra le asignamos un número de pista (1..6).
palabras.forEach((wordObj, index) => {
  const { text, row, col, dir } = wordObj;
  const numPista = index + 1; // 1 a 6
  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    gridData[r - 1][c - 1].isLetter = true;
    // Si ya existía una letra fija (intersección con "CASAMOS"), 
    // dejamos fixedChar tal cual y sólo actualizamos orientation si no estaba.
    if (!gridData[r - 1][c - 1].fixedChar) {
      // Solo si no es celda fija, marcamos orientation y número
      if (i === 0) {
        gridData[r - 1][c - 1].number = numPista;
        gridData[r - 1][c - 1].orientation = dir;
      } else {
        if (!gridData[r - 1][c - 1].orientation) {
          gridData[r - 1][c - 1].orientation = dir;
        }
      }
    }
  }
});

// 6. Pintamos el grid en el DOM
const contenedor = document.getElementById("crucigrama");

for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];
    const celdaDiv = document.createElement("div");

    if (!celdaInfo.isLetter) {
      // Celda que no forma parte de ninguna palabra
      celdaDiv.classList.add("cell", "blank");
    } else {
      // Celda que SÍ forma parte de palabra (fija o a resolver)
      celdaDiv.classList.add("cell");

      // Dependiendo de orientation, asignamos color (vertical u horizontal).
      // IMPORTANTE: en caso de intersección (fija + resolvible), 
      // puede que orientation viniera de fixedWords o de palabras.
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      // Si tiene fixedChar, es la palabra "CASAMOS" (o cualquier otra fija)
      if (celdaInfo.fixedChar) {
        // Mostramos la letra fija como <span class="fixed-letter">X</span>
        const spanF = document.createElement("span");
        spanF.classList.add("fixed-letter");
        spanF.textContent = celdaInfo.fixedChar;
        celdaDiv.appendChild(spanF);
      } else {
        // Si no tiene fixedChar, entonces es parte de alguna palabra a resolver
        // Puede tener número si es primera letra
        if (celdaInfo.number !== null) {
          const spanNum = document.createElement("span");
          spanNum.classList.add("number");
          spanNum.textContent = celdaInfo.number;
          celdaDiv.appendChild(spanNum);
        }
        // Creamos el <input> para que el usuario escriba la letra
        const inputLetra = document.createElement("input");
        inputLetra.setAttribute("type", "text");
        inputLetra.setAttribute("maxlength", "1");
        inputLetra.id = `cell-${fila + 1}-${col + 1}`;
        celdaDiv.appendChild(inputLetra);
      }
    }

    contenedor.appendChild(celdaDiv);
  }
}

// 7. Generar la lista de pistas descriptivas (sólo para las 6 palabras a resolver)
//    No incluimos “CASAMOS” aquí; nuestras pistas van del 1 al 6.
const listaPistas = document.getElementById("lista-pistas");
const pistasDescriptivas = [
  "Guarda o custodia que se hace de algo",
  "Sexta nota de la escala musical",
  "Tiempo en que se hace o sucede algo",
  "La suma de 10 + 17",
  "Último mes del año",
  "Forma que, en dativo o acusativo, designa a las personas que se hablan o escriben"
];

palabras.forEach((wordObj, index) => {
  const li = document.createElement("li");
  const num = index + 1; // 1..6
  li.innerHTML = `<strong>${num}.</strong> ${pistasDescriptivas[index]}`;
  listaPistas.appendChild(li);
});
