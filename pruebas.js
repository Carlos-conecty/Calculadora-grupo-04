"use strict";
/*
  pruebas.js · Pruebas automáticas del proyecto (Calculadora y conversor · Grupo 4)
  Uso:  node pruebas.js
  Carga app.js SIN modificarlo, usa un DOM simulado mínimo y pulsa los botones
  "Calcular" y "Convertir" como lo haría el navegador.
*/
const fs = require("fs");
const vm = require("vm");
const path = require("path");

function crearElemento() {
  return {
    value: "", className: "", textContent: "", children: [], oyentes: {},
    addEventListener(tipo, fn) { this.oyentes[tipo] = fn; },
    appendChild(hijo) { this.children.push(hijo); }
  };
}

const elementos = {};
const documentoFalso = {
  getElementById(id) { return (elementos[id] = elementos[id] || crearElemento()); },
  createElement() { return crearElemento(); }
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "app.js"), "utf8"), { document: documentoFalso });

function calcular(a, b, operacion) {
  documentoFalso.getElementById("a").value = a;
  documentoFalso.getElementById("b").value = b;
  documentoFalso.getElementById("operacion").value = operacion;
  documentoFalso.getElementById("calcular").oyentes.click();
  return documentoFalso.getElementById("resultado").textContent;
}
function convertir(valor, idConversion) {
  documentoFalso.getElementById("valorConv").value = valor;
  documentoFalso.getElementById("tipoConv").value = idConversion;
  documentoFalso.getElementById("convertir").oyentes.click();
  return documentoFalso.getElementById("resultadoConv").textContent;
}

const casos = [
  ["Conversor", "1 m a cm",        () => convertir("1", "m-cm"),     "1 m = 100 cm"],
  ["Conversor", "100 cm a m",      () => convertir("100", "cm-m"),   "100 cm = 1 m"],
  ["Conversor", "1 kg a g",        () => convertir("1", "kg-g"),     "1 kg = 1000 g"],
  ["Conversor", "1000 g a kg",     () => convertir("1000", "g-kg"),  "1000 g = 1 kg"],
  ["Conversor", "0 m a cm",        () => convertir("0", "m-cm"),     "0 m = 0 cm"],
  ["Conversor", "1.5 m a cm",      () => convertir("1.5", "m-cm"),   "1.5 m = 150 cm"],
  ["Conversor", "(vacío) m a cm",  () => convertir("", "m-cm"),      "Escriba un valor para convertir."],
  ["Conversor", "-5 m a cm",       () => convertir("-5", "m-cm"),    "No se admiten valores negativos."],
  ["Conversor", "abc m a cm",      () => convertir("abc", "m-cm"),   "Escriba un número válido."],
  ["Conversor", "-1 kg a g",       () => convertir("-1", "kg-g"),    "No se admiten valores negativos."],
  ["Calculadora", "12 + 3",        () => calcular("12", "3", "sumar"),       "Suma: 15"],
  ["Calculadora", "12 - 3",        () => calcular("12", "3", "restar"),      "Resta: 9"],
  ["Calculadora", "12 × 3",        () => calcular("12", "3", "multiplicar"), "Multiplicación: 36"],
  ["Calculadora", "12 ÷ 3",        () => calcular("12", "3", "dividir"),     "División: 4"],
  ["Calculadora", "12 ÷ 0",        () => calcular("12", "0", "dividir"),     "No se puede dividir entre cero."],
  ["Calculadora", "(vacío) + 3",   () => calcular("", "3", "sumar"),         "Complete las dos entradas."],
  ["Calculadora", "abc + 3",       () => calcular("abc", "3", "sumar"),      "Escriba números válidos en ambas entradas."]
];

let pasaron = 0;
casos.forEach(function (c, i) {
  const obtenido = c[2]();
  const ok = obtenido === c[3];
  if (ok) pasaron++;
  console.log((ok ? "✔" : "✘") + " " + String(i + 1).padStart(2, "0") + " " + c[0] + ": " + c[1] + " → " + obtenido + (ok ? "" : "   (esperado: " + c[3] + ")"));
});
console.log("\n" + pasaron + " de " + casos.length + " pruebas pasaron.");
process.exit(pasaron === casos.length ? 0 : 1);
