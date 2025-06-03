// 1. Definimos DOS listas de palabras:
//    a) fixedWords: "CASAMOS" (fija, no editable).
//    b) palabras: las 6 palabras que el usuario debe resolver.

const fixedWords = [
  { text: "CASAMOS", row: 7, col: 2, dir: "A" }
];

const palabras = [
  { text: "RESERVA",     row: 1,  col: 3,  dir: "D" }, // pista 1
  { text: "LA",          row: 6,  col: 5,  dir: "D" }, // pista 2
  { text: "FECHA",       row: 2,  col: 1,  dir: "A" }, // pista 3
  { text: "VEINTISIETE", row: 1,  col: 8,  dir: "D" }, // pista 4
  { text: "DICIEMBRE",   row: 11, col: 4,  dir: "A" }, // pista 5
  { text: "NOS",         row: 6,  col: 7,  dir: "D" }  // pista 6
];

// 2. Tamaño del crucigrama: 11 filas x 12 columnas (hoy usamos col=1..12).
const TOTAL_ROWS = 11;
const TOTAL_COLS = 12;

// 3. Creamos gridData: cada celda vacía al principio.
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,   // si forma parte de alguna palabra
      number: null,      // número de pista (solo para las palabras a resolver)
      orientation: null, // "A" u "D"
      fixedChar: null    // para las letras de fixedWords
    });
  }
  gridData.push(fila);
}

// 4. Marcamos las celdas de fixedWords (CASAMOS):
fixedWords.forEach(wordObj => {
  const { text, row, col, dir } = wordObj;
  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    gridData[r - 1][c - 1].isLetter = true;
    gridData[r - 1][c - 1].orientation = dir;
    gridData[r - 1][c - 1].fixedChar = text[i];
  }
});

// 5. Marcamos las celdas de las 6 palabras a resolver:
palabras.forEach((wordObj, index) => {
  const { text, row, col, dir } = wordObj;
  const numPista = index + 1; // 1..6
  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    gridData[r - 1][c - 1].isLetter = true;

    // Si ya existe fixedChar (intersección con CASAMOS), no reescribimos:
    if (!gridData[r - 1][c - 1].fixedChar) {
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
      // Si NO es parte de palabra, la dejamos vacía/transparent
      celdaDiv.classList.add("cell", "blank");
    } else {
      // Celda que SÍ pertenece a alguna palabra (fija o editable)
      celdaDiv.classList.add("cell");

      // *Color* según orientación (D=vertical → rosado; A=horizontal → verde)
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      // Si tiene fixedChar, es “CASAMOS” → lo mostramos como texto centrado
      if (celdaInfo.fixedChar) {
        // Agregamos la clase fixed-cell para centrar mediante flexbox
        celdaDiv.classList.add("fixed-cell");
        const spanF = document.createElement("span");
        spanF.classList.add("fixed-letter");
        spanF.textContent = celdaInfo.fixedChar;
        celdaDiv.appendChild(spanF);
      }
      // Si NO tiene fixedChar, es una celda editable:
      else {
        // Si es la primera letra de una palabra, ponemos número
        if (celdaInfo.number !== null) {
          const spanNum = document.createElement("span");
          spanNum.classList.add("number");
          spanNum.textContent = celdaInfo.number;
          celdaDiv.appendChild(spanNum);
        }
        // Luego creamos el <input> para que el usuario escriba la letra
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

// 7. Generamos las pistas descriptivas (solo para las 6 palabras a resolver)
//    Con <ol> y li.textContent: el navegador numera del 1 al 6 automáticamente.
const listaPistas = document.getElementById("lista-pistas");
const pistasDescriptivas = [
  "Guarda o custodia que se hace de algo",
  "Sexta nota de la escala musical",
  "Tiempo en que se hace o sucede algo",
  "La suma de 10 + 17",
  "Último mes del año",
  "Forma que, en dativo o acusativo, designa a las personas que se hablan o escriben"
];

palabras.forEach((_, index) => {
  const li = document.createElement("li");
  li.textContent = pistasDescriptivas[index];
  listaPistas.appendChild(li);
});
