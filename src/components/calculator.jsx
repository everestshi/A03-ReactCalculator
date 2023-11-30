import { useState } from "react";
import { calculatorButtons } from "../data/calculatorButtons";
import "../styles/calculator.css";

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [storedValue, setStoredValue] = useState("0");
  const [inputHistory, setInputHistory] = useState("");
  const [hasPoint, setHasPoint] = useState(false); // Whether the current number has a decimal point already
  const [lastEvaluated, setLastEvaluated] = useState(false);
  const [consecutiveDigitsCount, setConsecutiveDigitsCount] = useState(0);

  const MAX_RESULT_LENGTH = 13; // Set your desired maximum result length

  const isFloatingPointError = (num) => {
    const epsilon = 1e-14; // Define your precision threshold here
    return Math.abs(num - Math.floor(num)) > epsilon;
  };

  const roundIfNeeded = (num) => {
    if (isFloatingPointError(num)) {
      return Math.round(num * 1e14) / 1e14; // Round to a specific precision (10 decimal places in this case)
    }
    return num;
  };

  const handleMemoryOperationResult = (result) => {
    let formattedResult;
    if (Math.abs(result) > 1000000000) {
      // Convert to exponential notation if the result is larger than 100,000,000
      formattedResult = result.toExponential();
    } else {
      formattedResult = result.toString();
    }

    // Check if it's a floating-point error and round if needed
    const numResult = parseFloat(result);
    if (isFloatingPointError(numResult)) {
      formattedResult = roundIfNeeded(numResult).toString();
    }

    // Convert extremely small numbers to exponential notation
    if (Math.abs(numResult) > 0 && Math.abs(numResult) < 1e-14) {
      formattedResult = numResult.toExponential(MAX_RESULT_LENGTH - 6);
      formattedResult = formattedResult.replace(/(\d+(\.\d*?)?)0+e/, "$1e"); // Remove trailing zeros after e in exponential notation
    }

    // Truncate the result if it exceeds the maximum length
    if (formattedResult.includes("e")) {
      const [mantissa, exponent] = formattedResult.split("e");
      const maxMantissaLength = MAX_RESULT_LENGTH - exponent.length - 1;
      formattedResult = mantissa.slice(0, maxMantissaLength) + "e" + exponent;
    } else if (
      formattedResult.includes(".") &&
      formattedResult.includes("e-")
    ) {
      // Remove trailing zeros before 'e' in exponential notation
      formattedResult = formattedResult.replace(/(\.\d*?)0+(?=e-)/, "$1");
    } else if (formattedResult.length > MAX_RESULT_LENGTH) {
      formattedResult = formattedResult.slice(0, MAX_RESULT_LENGTH);
    }

    setDisplayValue(formattedResult);
    setInputHistory(formattedResult);
  };

  const handleMemoryOperationError = () => {
    setDisplayValue("Error");
    setInputHistory("");
  };

  const handleButtonClick = (value, type) => {
    const isOperator = (char) => {
      return char === "+" || char === "-" || char === "*" || char === "/";
    };

    if (type === "number") {
      if (consecutiveDigitsCount >= 9 && !isOperator(value)) {
        return;
      } else {
        // Increment the counter only if the entered value is a digit
        if (/\d/.test(value)) {
          setConsecutiveDigitsCount((prevCount) => prevCount + 1);
        }
        if (hasPoint && value === ".") return;
        if (!hasPoint && value === ".") setHasPoint(true);
        if (lastEvaluated) {
          // Clear the display and input history after an evaluation
          // If pressed decimal point button when there is no number, add a zero before it
          setDisplayValue((value == "." ? "0" : "") + value.toString());
          setInputHistory((value == "." ? "0" : "") + value.toString());
          setLastEvaluated(false);
        } else {
          setDisplayValue((prevDisplay) => {
            if (isOperator(inputHistory[inputHistory.length - 1])) {
              return (value == "." ? "0" : "") + value.toString();
            } else {
              return prevDisplay === "0"
                ? (value == "." ? "0" : "") + value.toString()
                : prevDisplay + value;
            }
          });
          setInputHistory(
            (prevHistory) =>
              prevHistory +
              (value == "." &&
              (prevHistory.length == 0 ||
                isOperator(inputHistory[inputHistory.length - 1]))
                ? "0"
                : "") +
              value
          );
        }
      }
    } else if (type === "operator") {
      setConsecutiveDigitsCount(0);
      setLastEvaluated(false);
      setHasPoint(false);
      const lastInput = inputHistory[inputHistory.length - 1];
      if (isOperator(lastInput)) {
        setInputHistory((prevHistory) => prevHistory.slice(0, -1) + value);
      } else if (lastInput === ".") {
        setDisplayValue((prevDisplay) => prevDisplay.slice(0, -1));
        setInputHistory((prevHistory) => prevHistory.slice(0, -1) + value);
      } else {
        setInputHistory((prevHistory) => prevHistory + value);
      }
    } else if (type === "enter") {
      calculateResult(inputHistory);
      setLastEvaluated(true); // Set the evaluation state
      setHasPoint(false);
    } else if (type === "memory") {
      handleMemory(value);
    } else if (type === "clear") {
      setConsecutiveDigitsCount(0);
      setHasPoint(false);

      handleClear(value);
    } else {
      switch (type) {
        case "sign":
          handleSign();
          break;
        case "percent":
          handlePercent();
          break;
        case "sqrt":
          handleSqrt();
          break;
        default:
          break;
      }
    }
  };

  const stringEval = (fn) => new Function("return " + fn)();

  const calculateResult = () => {
    try {
      const result = stringEval(inputHistory);
      let formattedResult;
      if (Math.abs(result) > 1000000000) {
        // Convert to exponential notation if the result is larger than 100,000,000
        formattedResult = result.toExponential();
      } else {
        formattedResult = result.toString();
      }

      // Check if it's a floating-point error and round if needed
      const numResult = parseFloat(result);
      if (isFloatingPointError(numResult)) {
        formattedResult = roundIfNeeded(numResult).toString();
      }

      // Convert extremely small numbers to exponential notation
      if (Math.abs(numResult) > 0 && Math.abs(numResult) < 1e-14) {
        formattedResult = numResult.toExponential(MAX_RESULT_LENGTH - 6);
        formattedResult = formattedResult.replace(/(\d+(\.\d*?)?)0+e/, "$1e"); // Remove trailing zeros after e in exponential notation
      }

      // Truncate the result if it exceeds the maximum length
      if (formattedResult.includes("e")) {
        const [mantissa, exponent] = formattedResult.split("e");
        const maxMantissaLength = MAX_RESULT_LENGTH - exponent.length - 1;
        formattedResult = mantissa.slice(0, maxMantissaLength) + "e" + exponent;
      } else if (
        formattedResult.includes(".") &&
        formattedResult.includes("e-")
      ) {
        // Remove trailing zeros before 'e' in exponential notation
        formattedResult = formattedResult.replace(/(\.\d*?)0+(?=e-)/, "$1");
      } else if (formattedResult.length > MAX_RESULT_LENGTH) {
        formattedResult = formattedResult.slice(0, MAX_RESULT_LENGTH);
      }

      setDisplayValue(formattedResult);
      setInputHistory(formattedResult);
    } catch (error) {
      handleMemoryOperationError();
    }
  };

  const handleMemory = (value) => {
    try {
      switch (value) {
        case "Memory Save":
          if (
            !isNaN(displayValue) &&
            displayValue !== "Error" &&
            displayValue !== "Infinity"
          ) {
            setStoredValue(displayValue);
          }
          break;
        case "Memory Clear":
          setStoredValue("0");
          break;
        case "Memory Recall":
          setDisplayValue(storedValue);
          setInputHistory(storedValue);
          break;
        case "Memory Subtract":
          try {
            let resultSubtract = "";
            if (displayValue.startsWith("-") && storedValue.startsWith("-")) {
              resultSubtract = stringEval(
                `(${displayValue}) - (${storedValue})`
              );
            } else {
              resultSubtract = stringEval(`${displayValue} - ${storedValue}`);
            }
            handleMemoryOperationResult(resultSubtract);
          } catch (error) {
            handleMemoryOperationError();
          }
          break;
        case "Memory Addition":
          try {
            const result = stringEval(displayValue + "+" + storedValue);
            console.log(result);
            handleMemoryOperationResult(result);
          } catch (error) {
            handleMemoryOperationError();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      handleMemoryOperationError();
    }
  };

  const handleClear = (value) => {
    if (value === "All Clear") {
      setDisplayValue("0");
      setInputHistory("");
      setStoredValue("0");
    } else if (value === "Clear") {
      setDisplayValue("0");
      setInputHistory("");
    }
  };

  const handleSign = () => {
    try {
      const result = stringEval(displayValue + "*(-1)");
      handleMemoryOperationResult(result);
    } catch (error) {
      handleMemoryOperationError();
    }
  };

  const handleSqrt = () => {
    const operators = ["+", "-", "*", "/"]; // List of operators
    const operatorIndexes = [];

    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });

      const result = Math.sqrt(stringEval(displayValue));
      let formattedResult = result.toString();
      formattedResult = formattedResult.slice(0, MAX_RESULT_LENGTH);
      setDisplayValue(formattedResult);
      if (inputHistory !== "") {
        setInputHistory(formattedResult);
      }
    } catch (error) {
      setDisplayValue("Error");
      setInputHistory("");
    }
  };

  const handlePercent = () => {
    const operators = ["+", "-", "*", "/"]; // List of operators
    const operatorIndexes = [];

    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });

      const result = stringEval(displayValue + "/ 100");
      handleMemoryOperationResult(result);
      setLastEvaluated(true); // Set the evaluation state
    } catch (error) {
      handleMemoryOperationError();
    }
  };

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="memory-board">
        <div className="memory-store">
          {storedValue !== "0" ? storedValue : "M"}
        </div>
        <div className="memory-input">{inputHistory}</div>
      </div>
      <div className="buttons-board">
        <div className="buttons">
          {calculatorButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(button.value, button.type)}
              className={button.className}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
