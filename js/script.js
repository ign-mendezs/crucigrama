// ------------------------------
// 1) DEFINICIÓN DE LAS PALABRAS
// ------------------------------

// fixedWords: “CASAMOS” (fija, no editable)
const fixedWords = [
  { text: "CASAMOS", row: 7, col: 1, dir: "A" }
];

// palabras: las 6 que el usuario debe rellenar, con sus cruces
const palabras = [
  { text: "RESERVA",     row: 1,  col: 2, dir: "D" },
  { text: "LA",          row: 6,  col: 4, dir: "D" },
  { text: "FECHA",       row: 2,  col: 1, dir: "A" },
  { text: "VEINTISIETE", row: 1,  col: 7, dir: "D" },
  { text: "DICIEMBRE",   row: 11, col: 3, dir: "A" },
  { text: "NOS",         row: 6,  col: 6, dir: "D" }
];

// ------------------------------
// 2) TAMAÑO DEL CRUCIGRAMA: 11×11
// ------------------------------
const TOTAL_ROWS = 11;
const TOTAL_COLS = 11;

// ------------------------------
// 3) CREAMOS GRIDDATA (11×11)
// ------------------------------
const gridData = [];
for (let r = 1; r <= TOTAL_ROWS; r++) {
  const fila = [];
  for (let c = 1; c <= TOTAL_COLS; c++) {
    fila.push({
      isLetter: false,
      number: null,
      orientation: null,
      fixedChar: null
    });
  }
  gridData.push(fila);
}

// ------------------------------
// 4) PINTAMOS “CASAMOS” (fixedWords)
// ------------------------------
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

// ------------------------------
// 5) PINTAMOS LAS 6 PALABRAS “RESOLVIBLES”
// ------------------------------
palabras.forEach((wordObj, index) => {
  const { text, row, col, dir } = wordObj;
  const numPista = index + 1;
  for (let i = 0; i < text.length; i++) {
    const r = dir === "D" ? row + i : row;
    const c = dir === "A" ? col + i : col;
    gridData[r - 1][c - 1].isLetter = true;
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

// ------------------------------
// 6) PINTAMOS EL GRID EN EL DOM
// ------------------------------
const contenedor = document.getElementById("crucigrama");
for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];
    const celdaDiv = document.createElement("div");

    if (!celdaInfo.isLetter) {
      celdaDiv.classList.add("cell", "blank");
    } else {
      celdaDiv.classList.add("cell");
      if (celdaInfo.orientation === "D") {
        celdaDiv.classList.add("vertical");
      } else if (celdaInfo.orientation === "A") {
        celdaDiv.classList.add("horizontal");
      }

      if (celdaInfo.fixedChar) {
        const spanF = document.createElement("span");
        spanF.classList.add("fixed-letter");
        spanF.textContent = celdaInfo.fixedChar;
        celdaDiv.appendChild(spanF);
      } else {
        if (celdaInfo.number !== null) {
          const spanNum = document.createElement("span");
          spanNum.classList.add("number");
          spanNum.textContent = celdaInfo.number;
          celdaDiv.appendChild(spanNum);
        }
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

// ──────────────────────────────────────────────────────────────────────
// Recorrer gridData para agregar listeners a cada <input> editable:
// ──────────────────────────────────────────────────────────────────────
for (let fila = 0; fila < TOTAL_ROWS; fila++) {
  for (let col = 0; col < TOTAL_COLS; col++) {
    const celdaInfo = gridData[fila][col];

    // Solo si esta celda es parte de palabra y NO es fija (tiene <input>)
    if (celdaInfo.isLetter && !celdaInfo.fixedChar) {
      const input = document.getElementById(`cell-${fila + 1}-${col + 1}`);
      if (!input) continue;

      const orient = celdaInfo.orientation; // "A" (horizontal) o "D" (vertical)

      // ──────────────────────────────────────────────────────────────────
      // 1) Listener para “input” → auto‐avanzar pero saltando celdas sin <input>
      // ──────────────────────────────────────────────────────────────────
      input.addEventListener("input", (e) => {
        const valor = e.target.value.toUpperCase();

        // Si pegó más de 1 carácter, nos quedamos solo con el primero:
        if (valor.length > 1) {
          e.target.value = valor.charAt(0);
        } else {
          e.target.value = valor;
        }

        // Si el usuario escribió una letra A–Z, avanzamos al siguiente <input> válido
        if (valor.match(/^[A-Z]$/)) {
          // Partimos desde la casilla contigua “inmediata”
          let siguienteFila = fila + (orient === "D" ? 1 : 0);
          let siguienteCol = col + (orient === "A" ? 1 : 0);

          // Buscamos hacia adelante mientras haya casillas de la misma palabra
          while (
            siguienteFila < TOTAL_ROWS &&
            siguienteCol < TOTAL_COLS
          ) {
            const infoSig = gridData[siguienteFila][siguienteCol];
            // Si esa celda NO es parte de palabra → salimos del while
            if (!infoSig.isLetter) break;
            // Si esa celda es fija o no tiene <input> (fija: fixedChar),
            // entonces saltamos a la siguiente en la misma orientación:
            if (infoSig.fixedChar) {
              siguienteFila += orient === "D" ? 1 : 0;
              siguienteCol += orient === "A" ? 1 : 0;
              continue;
            }
            // Si llega aquí, es una celda editable con <input> disponible:
            const siguienteInput = document.getElementById(
              `cell-${siguienteFila + 1}-${siguienteCol + 1}`
            );
            if (siguienteInput) {
              siguienteInput.focus();
            }
            break;
          }
        }
      });

      // ──────────────────────────────────────────────────────────────────
      // 2) Listener para “paste” → repartir caracteres pegados hacia adelante
      // ──────────────────────────────────────────────────────────────────
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const texto = (e.clipboardData || window.clipboardData).getData("text");
        const letras = texto.toUpperCase().match(/[A-Z]/g) || [];

        // Partimos desde la posición actual (fila, col)
        let r = fila;
        let c = col;

        for (let i = 0; i < letras.length; i++) {
          // Si esa casilla ya no es parte de la palabra, o es fija, rompemos
          if (
            r < 0 ||
            c < 0 ||
            r >= TOTAL_ROWS ||
            c >= TOTAL_COLS ||
            !gridData[r][c].isLetter ||
            gridData[r][c].fixedChar
          ) {
            break;
          }

          const campo = document.getElementById(`cell-${r + 1}-${c + 1}`);
          if (!campo) break;
          campo.value = letras[i];

          // Avanzamos a la siguiente casilla lógica:
          let rNext = r + (orient === "D" ? 1 : 0);
          let cNext = c + (orient === "A" ? 1 : 0);

          // Si la siguiente es fija o no existe, saltamos hasta encontrar el próximo <input>
          while (
            rNext < TOTAL_ROWS &&
            cNext < TOTAL_COLS &&
            gridData[rNext][cNext].isLetter &&
            gridData[rNext][cNext].fixedChar
          ) {
            rNext += orient === "D" ? 1 : 0;
            cNext += orient === "A" ? 1 : 0;
          }

          r = rNext;
          c = cNext;
        }

        // Finalmente posicionamos el foco en la última casilla llenada
        // (salteada de la misma forma que al escribir)
        if (
          r < TOTAL_ROWS &&
          c < TOTAL_COLS &&
          gridData[r][c].isLetter &&
          !gridData[r][c].fixedChar
        ) {
          const ultimoCampo = document.getElementById(
            `cell-${r + 1}-${c + 1}`
          );
          if (ultimoCampo) ultimoCampo.focus();
        }
      });
    }
  }
}

// ------------------------------
// 7) GENERAMOS LISTA DE PISTAS EN <ol>
// ------------------------------
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

// ------------------------------
// 8) DEFINIMOS OBJETO “soluciones”
// ------------------------------
const soluciones = {
  // RESERVA (1,2)→(7,2)
  "1-2": "R",
  "2-2": "E",
  "3-2": "S",
  "4-2": "E",
  "5-2": "R",
  "6-2": "V",

  // LA (6,4)→(7,4)
  "6-4": "L",

  // FECHA (2,1)→(2,5)
  "2-1": "F",
  "2-2": "E",
  "2-3": "C",
  "2-4": "H",
  "2-5": "A",

  // VEINTISIETE (1,7)→(11,7)
  "1-7":  "V",
  "2-7":  "E",
  "3-7":  "I",
  "4-7":  "N",
  "5-7":  "T",
  "6-7":  "I",
  "8-7":  "I",
  "9-7":  "E",
  "10-7": "T",
  "11-7": "E",

  // DICIEMBRE (11,3)→(11,11)
  "11-3": "D",
  "11-4": "I",
  "11-5": "C",
  "11-6": "I",
  "11-7": "E",
  "11-8": "M",
  "11-9": "B",
  "11-10": "R",
  "11-11": "E",

  // NOS (6,6)→(8,6)
  "6-6": "N",
  "8-6": "S"
};

// ------------------------------
// 9) LISTENER PARA “VERIFICAR RESPUESTAS”
// ------------------------------
document.getElementById("btn-verificar").addEventListener("click", () => {
  let todasCorrectas = true;

  for (const key in soluciones) {
    const [fila, col] = key.split("-");
    const input = document.getElementById(`cell-${fila}-${col}`);
    if (!input) {
      todasCorrectas = false;
      break;
    }
    const valorUsuario = input.value.toUpperCase();
    const letraCorrecta = soluciones[key];

    if (valorUsuario !== letraCorrecta) {
      todasCorrectas = false;
      break;
    }
  }

  if (todasCorrectas) {
    document.getElementById("modal-exito").classList.add("activo");
  } else {
    alert("Aún falta alguna respuesta o hay errores. Revisa el crucigrama.");
  }
});

// ------------------------------
// 10) LISTENER PARA “CERRAR MODAL”
// ------------------------------
document.getElementById("btn-cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-exito").classList.remove("activo");
});
