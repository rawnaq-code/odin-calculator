function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return b === 0 ? NaN : a / b;
}

function operate(a, b, operator) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "X":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return b;
    }
}

const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculateExpression(text) {
    const tokens = text.trim().match(/\d*\.?\d+|[+\-X/]/g);

    if (!tokens || tokens.length < 3 || tokens.length % 2 === 0) {
        return null;
    }

    let result = Number(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        result = operate(result, Number(tokens[i + 1]), tokens[i]);

        if (!Number.isFinite(result)) {
            return null;
        }
    }

    return Math.round((result + Number.EPSILON) * 1e8) / 1e8;
}

buttons.addEventListener("click", (e) => {
    if (!e.target.matches("button")) return;

    const clicked = e.target.textContent.trim();
    const operators = ["+", "-", "X", "/"];

    if (clicked === "clear") {
        expression = "";
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (clicked === "del") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (/^\d$/.test(clicked)) {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        }

        expression += clicked;
        updateDisplay();
        return;
    }

    if (clicked === ".") {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        }

        const currentNumber = expression.split(/[+\-X/]/).pop();

        if (!currentNumber.includes(".")) {
            expression += currentNumber === "" ? "0." : ".";
        }

        updateDisplay();
        return;
    }

    if (operators.includes(clicked)) {
        if (justCalculated) {
            justCalculated = false;
        }

        const trimmed = expression.trim();

        if (!trimmed) {
            if (clicked === "-") expression = "-";
            updateDisplay();
            return;
        }

        if (/[+\-X/]$/.test(trimmed)) {
            expression = trimmed.slice(0, -1).trimEnd();
        } else if (/[+\-X/]/.test(trimmed)) {
            const result = calculateExpression(trimmed);

            if (result === null) return;

            expression = String(result);
        }

        expression += " " + clicked + " ";
        updateDisplay();
        return;
    }

    if (clicked === "=") {
        const result = calculateExpression(expression);

        if (result !== null) {
            expression = String(result);
            justCalculated = true;
        }

        updateDisplay();
    }
});

updateDisplay();