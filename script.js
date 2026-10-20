const currentDisplay = document.querySelector("#current");
const previousDisplay = document.querySelector("#previous");
const keys = document.querySelector(".keys");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentDisplay.textContent = currentValue.replace(".", ",");
  previousDisplay.textContent = previousValue !== null && operator
    ? `${previousValue.replace(".", ",")} ${operator}`
    : "";
}

function inputNumber(number) {
  if (currentValue === "Erro" || shouldResetScreen) {
    currentValue = number;
    shouldResetScreen = false;
  } else if (currentValue === "0") {
    currentValue = number;
  } else if (currentValue.replace("-", "").replace(".", "").length < 14) {
    currentValue += number;
  }
  updateDisplay();
}

function inputDecimal() {
  if (currentValue === "Erro" || shouldResetScreen) {
    currentValue = "0.";
    shouldResetScreen = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function calculate(a, op, b) {
  const first = Number(a);
  const second = Number(b);
  let result;

  switch (op) {
    case "+": result = first + second; break;
    case "−": result = first - second; break;
    case "×": result = first * second; break;
    case "÷":
      if (second === 0) return null;
      result = first / second;
      break;
    default: return second;
  }

  if (!Number.isFinite(result)) return null;
  return String(Number(result.toPrecision(12)));
}

function chooseOperator(nextOperator) {
  if (currentValue === "Erro") return;

  if (operator && !shouldResetScreen) {
    const result = calculate(previousValue, operator, currentValue);
    if (result === null) {
      showError();
      return;
    }
    currentValue = result;
  }

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetScreen = true;
  updateDisplay();
}

function showError() {
  currentValue = "Erro";
  previousValue = null;
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

function equals() {
  if (!operator || previousValue === null || currentValue === "Erro") return;

  const result = calculate(previousValue, operator, currentValue);
  if (result === null) {
    showError();
    return;
  }

  previousDisplay.textContent = `${previousValue.replace(".", ",")} ${operator} ${currentValue.replace(".", ",")} =`;
  currentValue = result;
  previousValue = null;
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

function clear() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetScreen || currentValue === "Erro") {
    currentValue = "0";
    shouldResetScreen = false;
  } else {
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    if (currentValue === "-") currentValue = "0";
  }
  updateDisplay();
}

function toggleSign() {
  if (currentValue === "0" || currentValue === "Erro") return;
  currentValue = currentValue.startsWith("-") ? currentValue.slice(1) : "-" + currentValue;
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);

  switch (button.dataset.action) {
    case "clear": clear(); break;
    case "delete": deleteLast(); break;
    case "decimal": inputDecimal(); break;
    case "sign": toggleSign(); break;
    case "equals": equals(); break;
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === "." || event.key === ",") inputDecimal();
  else if (event.key === "+") chooseOperator("+");
  else if (event.key === "-") chooseOperator("−");
  else if (event.key === "*") chooseOperator("×");
  else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") equals();
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clear();
});

updateDisplay();
