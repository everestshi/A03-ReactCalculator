import { useState } from 'react';
import { calculatorButtons } from '../data/calculatorButtons';
import '../styles/calculator.css';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState('0');
  const [inputHistory, setInputHistory] = useState('');
  const [hasPoint, setHasPoint] = useState(false); // Whether the current number has a decimal point already
  const [lastEvaluated, setLastEvaluated] = useState(false);
  const [consecutiveDigitsCount, setConsecutiveDigitsCount] = useState(0);

  const MAX_RESULT_LENGTH = 13; // Set your desired maximum result length

  const handleMemoryOperationResult = (result) => {
    let formattedResult = result.toString();
  
    // Truncate the result if it exceeds the maximum length
    if (formattedResult.includes('e')) {
      // If in exponential notation
      const [mantissa, exponent] = formattedResult.split('e');
      const maxMantissaLength = MAX_RESULT_LENGTH - exponent.length - 1; // Leave space for the 'e' and exponent
      formattedResult = mantissa.slice(0, maxMantissaLength) + 'e' + exponent;
    } else if (formattedResult.length > MAX_RESULT_LENGTH) {
      // If in regular numeric form
      formattedResult = formattedResult.slice(0, MAX_RESULT_LENGTH);
    }
  
    setDisplayValue(formattedResult);
    setInputHistory(formattedResult);
  };
  
  const handleMemoryOperationError = () => {
    setDisplayValue('Error');
    setInputHistory('');
  };
  
  const handleButtonClick = (value, type) => {

    const isOperator = (char) => {
      return char === '+' || char === '-' || char === '*' || char === '/';
    };
    
    if (type === 'number') {
      if (consecutiveDigitsCount >= 9 && !isOperator(value)) {
        return;
      } else {
        // Increment the counter only if the entered value is a digit
        if (/\d/.test(value)) {
          setConsecutiveDigitsCount((prevCount) => prevCount + 1);
        }
      if (hasPoint && value === '.') return;
      if (!hasPoint && value === '.') setHasPoint(true);
      if (lastEvaluated) {
        // Clear the display and input history after an evaluation
        setDisplayValue(value.toString());
        setInputHistory(value.toString());
        setLastEvaluated(false);
      } else {
      setDisplayValue((prevDisplay) => {
        if (isOperator(inputHistory[inputHistory.length - 1])) {
          return value.toString();
        } else {
          return prevDisplay === '0' ? value.toString() : prevDisplay + value;
        }
      });
      setInputHistory((prevHistory) => prevHistory + value);
    }}
    } else if (type === 'operator') {
      setConsecutiveDigitsCount(0);
      setLastEvaluated(false);
      setHasPoint(false);
      const lastInput = inputHistory[inputHistory.length - 1];
      if (isOperator(lastInput)) {
        setInputHistory((prevHistory) => prevHistory.slice(0, -1) + value);
      } else if (lastInput === '.') {
        setDisplayValue((prevDisplay) => prevDisplay.slice(0, -1));
        setInputHistory((prevHistory) => prevHistory.slice(0, -1) + value);
      } else {
        setInputHistory((prevHistory) => prevHistory + value);
      }
    } else if (type === 'enter') {
      calculateResult(inputHistory);
      setLastEvaluated(true); // Set the evaluation state
    } else if (type === 'memory') {
      handleMemory(value);
    } else if (type === 'clear') {
      setConsecutiveDigitsCount(0);

      handleClear(value);
    } else {
      switch (type) {
        case 'sign':
          handleSign();
          break;
        case 'percent':
          handlePercent();
          break;
        case 'sqrt':
          handleSqrt();
          break;
        default:
          break;
      }
    }
  };

  const stringEval = (fn) => new Function('return ' + fn)();

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
  
      // Truncate the result if it exceeds the maximum length
      if (formattedResult.includes('e')) {
        // If in exponential notation
        const [mantissa, exponent] = formattedResult.split('e');
        const maxMantissaLength = MAX_RESULT_LENGTH - exponent.length - 1; // Leave space for the 'e' and exponent
        formattedResult = mantissa.slice(0, maxMantissaLength) + 'e' + exponent;
      } else if (formattedResult.length > MAX_RESULT_LENGTH) {
        // If in regular numeric form
        formattedResult = formattedResult.slice(0, MAX_RESULT_LENGTH);
      }
  
      setDisplayValue(formattedResult);
      setInputHistory(formattedResult);
    } catch (error) {
      handleMemoryOperationError();
    }
  };

  const handleMemory = (value) => {
    const isInteger = /^\d+$/.test(displayValue);
    switch (value) {
      case 'Memory Save':
        if (isInteger){
          setStoredValue(displayValue);
        }
        break;
      case 'Memory Clear':
        setStoredValue('0');
        break;
      case 'Memory Recall':
        setDisplayValue(storedValue);
        setInputHistory(storedValue)
        break;
        case 'Memory Subtract':
          try {
            const result = stringEval(displayValue + '-' + storedValue);
            handleMemoryOperationResult(result);
          } catch (error) {
            handleMemoryOperationError();
          }
          break;
        case 'Memory Addition':
          try {
            const result = stringEval(displayValue + '+' + storedValue);
            handleMemoryOperationResult(result);
          } catch (error) {
            handleMemoryOperationError();
          }
          break;
      default:
        break;
    }
  };

  const handleClear = (value) => {
    if (value === 'All Clear') {
      setDisplayValue('0');
      setInputHistory('');
      setStoredValue('0');

    } else if (value === 'Clear') {
      setDisplayValue('0');
      setInputHistory('');
    }
  };

  const handleSign = () => {
    try {
      const result = stringEval(displayValue + '*(-1)');
      handleMemoryOperationResult(result);
    } catch (error) {
      handleMemoryOperationError();
    }
  }

  const handleSqrt = () => {
    const operators = ['+', '-', '*', '/']; // List of operators
    const operatorIndexes = [];
  
    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });
  
      const result = Math.sqrt(stringEval(displayValue));
      handleMemoryOperationResult(result);

    } catch (error) {
      handleMemoryOperationError();
    }
  };
  

  const handlePercent = () => {
    const operators = ['+', '-', '*', '/']; // List of operators
    const operatorIndexes = [];
  
    try {
      operators.forEach((operator) => {
        let index = inputHistory.lastIndexOf(operator);
        if (index !== -1) {
          operatorIndexes.push({ index, operator });
        }
      });
  
      const result = stringEval(displayValue + '/ 100');
      handleMemoryOperationResult(result);

    } catch (error) {
      handleMemoryOperationError();
    }
  };

  
  

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="memory-board">
        <div className="memory-store">{storedValue !== '0' ? storedValue : 'M'}</div>
        <div className="memory-input">{inputHistory}</div>
      </div>
      <div className ="buttons-board">
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

