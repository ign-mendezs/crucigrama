// 1. Definimos “fixedWords” (solo CASAMOS) y “palabras” (las 6 a resolver):

//   a) fixedWords: “CASAMOS” siempre aparece sin <input>, horizontal en fila 7, cols 1→7
const fixedWords = [
  { text: "CASAMOS", row: 7, col: 1, dir: "A" }
];

//   b) palabras: cada objeto indica la palabra a resolver, su posición y orientación.
//      Asegúrate de que estas coordenadas cumplan las intersecciones letra a letra:
const palabras = [
  // RESERVA (7 letras). Su “A” final debe caer en (7,2), coincidiendo con la 2ª letra “A” de CASAMOS.
  // Por eso la ubicamos en row:1, col:2, dir:"D" → (1,2)→(7,2).
  { text: "RESERVA", row: 1, col: 2, dir: "D" },

  // LA (2 letras). Su “A” final en (7,4) coincide con la 4ª letra “A” de CASAMOS.
  // Entonces va en row:6, col:4, dir:"D" → (6,4)→(7,4).
  { text: "LA",      row: 6, col: 4, dir: "D" },

  // FECHA (5 letras). Horizontal en fila 2, desde col:1 hasta col:5, sin cruces con CASAMOS.
  { text: "FECHA",   row: 2, col: 1, dir: "A" },

  // VEINTISIETE (11 letras). Su 7ª letra “S” debe caer en (7,7), cruzando con la última “S” de CASAMOS.
  // Por eso la ubicamos en row:1, col:7, dir:"D" → (1,7)→(11,7).
  { text: "VEINTISIETE", row: 1, col: 7, dir: "D" },

  // DICIEMBRE (9 letras). Queremos que su primera “E” (5ª letra) caiga en (11,7) cruzando con VEINTISIETE.
  // DICIEMBRE se extiende de col:3 a col:11 en fila 11 → row:11, col:3, dir:"A".
  { text: "DICIEMBRE",   row: 11, col: 3, dir: "A" },

  // NOS (3 letras). Su “O” (2ª letra) debe caer en (7,6), cruzando con la 6ª letra “O” de CASAMOS.
  // Entonces va en row:6, col:6, dir:"D" → (6,6)→(8,6).
  { text: "NOS", row: 6, col: 6, dir: "D" }
];

// 2. Definimos tamaño del crucigrama: 11 filas x 11 columnas
const TOTAL_ROWS = 11;
const TOTAL_COLS = 11;

// 3. Creamos una matriz 11×11 donde cada celda arranca vacía:
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,   // si la celda forma parte de alguna palabra
      number: null,      // número de pista (solo para la primera letra editable)
      orientation: null, // “D” para vertical o “A” para horizontal
      fixedChar: null    // si forma parte de “fixedWords”, guardamos la letra
    });
  }
  gridData.push(fila);
}

// 4. Marcamos en gridData cada letra de fixedWords (“CASAMOS”):
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

// 5. Marcamos en gridData cada letra de las 6 palabras “resolvibles”:
palabras.forEach((wordObj, index) => {
  const { text, row, col, dir } = wordObj;
  const numPista = index + 1; // 1..6

  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    gridData[r - 1][c - 1].isLetter = true;

    // Si ya hay fixedChar (cruce con CASAMOS o con VEINTISIETE), no sobrescribimos nada.
    if (!gridData[r - 1][c - 1].fixedChar) {
      if (i === 0) {
        // Primera letra → número de pista y orientación
        gridData[r - 1][c - 1].number = numPista;
        gridData[r - 1][c - 1].orientation = dir;
      } else {
        // Letras intermedias solo asignan orientación si falta
        if (!gridData[r - 1][c - 1].orientation) {
          gridData[r - 1][c - 1].orientation = dir;
        }
      }
    }
  }
});

// 6. Pintamos el grid en el DOM (dentro de <div id="crucigrama" class="grid">)
const contenedor = document.getElementById("crucigrama");

for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];
    const celdaDiv = document.createElement("div");

    if (!celdaInfo.isLetter) {
      // Si NO forma parte de palabra → clase "blank" (celda transparente)
      celdaDiv.classList.add("cell", "blank");
    } else {
      // Si SÍ forma parte de palabra (fija o editable)
      celdaDiv.classList.add("cell");

      // Le damos color según orientación:
      // "D" → vertical (rosado); "A" → horizontal (verde)
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      // Si existe fixedChar, mostramos esa letra sin <input>
      if (celdaInfo.fixedChar) {
        const spanF = document.createElement("span");
        spanF.classList.add("fixed-letter");
        spanF.textContent = celdaInfo.fixedChar;
        celdaDiv.appendChild(spanF);
      } else {
        // Si NO tiene fixedChar → es celda editable.
        // Si tiene “number” (primera letra de palabra) lo mostramos:
        if (celdaInfo.number !== null) {
          const spanNum = document.createElement("span");
          spanNum.classList.add("number");
          spanNum.textContent = celdaInfo.number;
          celdaDiv.appendChild(spanNum);
        }
        // Luego el <input> para que el usuario escriba la letra
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

// 7. Generamos la lista de pistas dentro de un <ol> (1..6) sin numerarlas manualmente:
const listaPistas = document.getElementById("lista-pistas");
const pistasDescriptivas = [
  "Guarda o custodia que se hace de algo",                                                              // 1
  "Sexta nota de la escala musical",                                                                    // 2
  "Tiempo en que se hace o sucede algo",                                                                // 3
  "La suma de 10 + 17",                                                                                 // 4
  "Último mes del año",                                                                                 // 5
  "Forma que, en dativo o acusativo, designa a las personas que se hablan o escriben"                   // 6
];

// El <ol> ya numerará 1..6. Aquí solo inyectamos el texto:
palabras.forEach((_, index) => {
  const li = document.createElement("li");
  li.textContent = pistasDescriptivas[index];
  listaPistas.appendChild(li);
});
