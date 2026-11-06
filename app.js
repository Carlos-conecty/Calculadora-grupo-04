"use strict";

/* =====================================================================
   PARTE 1 · CALCULADORA ORIGINAL (conservada sin cambios de lógica)
   ===================================================================== */
document.getElementById("calcular").addEventListener("click", function () {
  // 1. ENTRADA: se leen los textos y se quitan espacios sobrantes
  const textoA = document.getElementById("a").value.trim();
  const textoB = document.getElementById("b").value.trim();
  const operacion = document.getElementById("operacion").value;
  const salida = document.getElementById("resultado");

  function mostrarError(mensaje) {
    salida.className = "resultado error";
    salida.textContent = mensaje;
  }
  function mostrarResultado(mensaje) {
    salida.className = "resultado ok";
    salida.textContent = mensaje;
  }

  // 2. VALIDACIÓN 1: entrada vacía (Number("") devuelve 0, por eso se revisa antes)
  if (textoA === "" || textoB === "") {
    mostrarError("Complete las dos entradas.");
    return;
  }

  const a = Number(textoA);
  const b = Number(textoB);

  // 3. VALIDACIÓN 2: número no válido
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    mostrarError("Escriba números válidos en ambas entradas.");
    return;
  }

  // 4. VALIDACIÓN 3: divisor cero
  if (operacion === "dividir" && b === 0) {
    mostrarError("No se puede dividir entre cero.");
    return;
  }

  // 5. OPERACIÓN y SALIDA
  if (operacion === "sumar") {
    mostrarResultado("Suma: " + (a + b));
  } else if (operacion === "restar") {
    mostrarResultado("Resta: " + (a - b));
  } else if (operacion === "multiplicar") {
    mostrarResultado("Multiplicación: " + (a * b));
  } else {
    mostrarResultado("División: " + (a / b));
  }
});

/* =====================================================================
   PARTE 2 · CONVERSOR DE UNIDADES (Semana 9)
   JSON/objetos = datos; la función convertir() = ejecuta el cálculo.
   ===================================================================== */

// Lista de objetos de conversión (datos)
const conversiones = [
  { id: "m-cm", etiqueta: "Metros a centímetros", origen: "m",  destino: "cm", factor: 100,  operacion: "multiplicar" },
  { id: "cm-m", etiqueta: "Centímetros a metros", origen: "cm", destino: "m",  factor: 100,  operacion: "dividir" },
  { id: "kg-g", etiqueta: "Kilogramos a gramos",  origen: "kg", destino: "g",  factor: 1000, operacion: "multiplicar" },
  { id: "g-kg", etiqueta: "Gramos a kilogramos",  origen: "g",  destino: "kg", factor: 1000, operacion: "dividir" }
];

// Función que calcula. Devuelve { ok: true, valor, texto } o { ok: false, mensaje }
function convertir(textoValor, idConversion) {
  const texto = String(textoValor).trim();

  // Campo vacío (se revisa antes de convertir porque Number("") es 0)
  if (texto === "") {
    return { ok: false, mensaje: "Escriba un valor para convertir." };
  }

  const valor = Number(texto);

  // Número no finito (texto, NaN, Infinity)
  if (!Number.isFinite(valor)) {
    return { ok: false, mensaje: "Escriba un número válido." };
  }

  // Valor negativo
  if (valor < 0) {
    return { ok: false, mensaje: "No se admiten valores negativos." };
  }

  const regla = conversiones.find(function (c) { return c.id === idConversion; });
  if (!regla) {
    return { ok: false, mensaje: "Elija una conversión válida." };
  }

  const resultado = regla.operacion === "multiplicar"
    ? valor * regla.factor
    : valor / regla.factor;

  return {
    ok: true,
    valor: resultado,
    texto: valor + " " + regla.origen + " = " + resultado + " " + regla.destino
  };
}

// Llenar el selector desde la lista de objetos
const selectorConv = document.getElementById("tipoConv");
conversiones.forEach(function (c) {
  const opcion = document.createElement("option");
  opcion.value = c.id;
  opcion.textContent = c.etiqueta;
  selectorConv.appendChild(opcion);
});

// Botón Convertir
document.getElementById("convertir").addEventListener("click", function () {
  const salida = document.getElementById("resultadoConv");
  const r = convertir(document.getElementById("valorConv").value, selectorConv.value);
  if (r.ok) {
    salida.className = "resultado ok";
    salida.textContent = r.texto;
  } else {
    salida.className = "resultado error";
    salida.textContent = r.mensaje;
  }
});
